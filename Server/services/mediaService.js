import { v2 as cloudinary } from "cloudinary";
import Recording from "../models/Recording.js";

// Initialize cloudinary - this assumes cloudinary config is set up in cloudinary.js
// and imported at the application startup

/**
 * Service for handling media-related operations
 */
export const mediaService = {
    /**
     * Get video streaming URL
     * @param {string} fileId Cloudinary public ID
     * @returns {string} Streaming URL
     */
    getStreamingUrl: (fileId) => {
        return cloudinary.video(fileId, {
            streaming_profile: "hd",
            resource_type: "video"
        }).toURL();
    },

    /**
     * Generate a thumbnail from a video
     * @param {string} fileId Cloudinary public ID
     * @returns {string} Thumbnail URL
     */
    generateThumbnail: (fileId) => {
        return cloudinary.video(fileId, {
            transformation: [
                { width: 300, crop: "scale" },
                { start_offset: "0", format: "jpg" }
            ],
            resource_type: "video"
        }).toURL();
    },

    /**
     * Check for and remove expired recordings (cleanup job)
     * This would be run by a scheduled task
     * @returns {Promise<{removed: number, failed: number}>} Result of cleanup operation
     */
    cleanupExpiredRecordings: async () => {
        try {
            const now = new Date();

            // Find expired recordings that are still active
            const expiredRecordings = await Recording.find({
                accessExpires: { $lt: now },
                isActive: true
            }).select("_id title fileId");

            if (expiredRecordings.length === 0) {
                return { removed: 0, failed: 0 };
            }

            let removed = 0;
            let failed = 0;

            // Mark them as inactive
            for (const recording of expiredRecordings) {
                try {
                    recording.isActive = false;
                    await recording.save();
                    removed++;
                } catch (error) {
                    console.error(`Failed to deactivate recording ${recording._id}:`, error);
                    failed++;
                }
            }

            return { removed, failed };
        } catch (error) {
            console.error("Error cleaning up expired recordings:", error);
            throw error;
        }
    },

    /**
     * Get recording statistics for a specific period
     * @param {Object} query Query filters
     * @param {Date} startDate Start date for stats
     * @param {Date} endDate End date for stats
     * @returns {Promise<Object>} Statistics data
     */
    getRecordingStats: async (query, startDate, endDate) => {
        try {
            // Build query with date range
            const dateQuery = {
                ...query,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate || new Date()
                }
            };

            // Get basic stats
            const stats = await Recording.aggregate([
                { $match: dateQuery },
                {
                    $group: {
                        _id: null,
                        totalRecordings: { $sum: 1 },
                        totalViews: { $sum: "$views" },
                        avgViews: { $avg: "$views" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalRecordings: 1,
                        totalViews: 1,
                        avgViews: { $round: ["$avgViews", 2] }
                    }
                }
            ]);

            // Get recordings per day
            const recordingsPerDay = await Recording.aggregate([
                { $match: dateQuery },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        date: "$_id",
                        count: 1,
                        _id: 0
                    }
                }
            ]);

            return {
                summary: stats[0] || { totalRecordings: 0, totalViews: 0, avgViews: 0 },
                daily: recordingsPerDay
            };
        } catch (error) {
            console.error("Error getting recording stats:", error);
            throw error;
        }
    }
};

export default mediaService;
