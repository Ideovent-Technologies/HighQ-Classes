import { useState, useEffect, useCallback } from 'react';
import batchService, { StudentBatchInfo } from '@/API/services/batchService';

interface UseBatchReturn {
  batchInfo: StudentBatchInfo | null;
  materials: any[];
  recordings: any[];
  assignments: any[];
  attendance: any;
  loading: boolean;
  error: string | null;
  refreshBatch: () => Promise<void>;
  isAssigned: boolean;
}

/**
 * Hook for managing student's batch data and related content
 */
export const useBatch = (): UseBatchReturn => {
  const [batchInfo, setBatchInfo] = useState<StudentBatchInfo | null>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch batch info first
      const batch = await batchService.getStudentBatch();
      setBatchInfo(batch);

      if (!batch) {
        setMaterials([]);
        setRecordings([]);
        setAssignments([]);
        setAttendance(null);
        return;
      }

      // Fetch batch content in parallel
      const [materialsResult, recordingsResult, assignmentsResult, attendanceResult] = await Promise.allSettled([
        batchService.getBatchMaterials(),
        batchService.getBatchRecordings(),
        batchService.getBatchAssignments(),
        batchService.getStudentAttendance()
      ]);

      // Handle results
      if (materialsResult.status === 'fulfilled') {
        setMaterials(materialsResult.value);
      } else {
        console.error('Failed to fetch materials:', materialsResult.reason);
      }

      if (recordingsResult.status === 'fulfilled') {
        setRecordings(recordingsResult.value);
      } else {
        console.error('Failed to fetch recordings:', recordingsResult.reason);
      }

      if (assignmentsResult.status === 'fulfilled') {
        setAssignments(assignmentsResult.value);
      } else {
        console.error('Failed to fetch assignments:', assignmentsResult.reason);
      }

      if (attendanceResult.status === 'fulfilled') {
        setAttendance(attendanceResult.value);
      } else {
        console.error('Failed to fetch attendance:', attendanceResult.reason);
      }

    } catch (err: any) {
      console.error('Error fetching batch data:', err);
      setError(err.message || 'Failed to load batch information');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatchData();
  }, [fetchBatchData]);

  const refreshBatch = useCallback(async () => {
    await fetchBatchData();
  }, [fetchBatchData]);

  return {
    batchInfo,
    materials,
    recordings,
    assignments,
    attendance,
    loading,
    error,
    refreshBatch,
    isAssigned: !!batchInfo
  };
};

/**
 * Hook for getting only batch info (lighter version)
 */
export const useBatchInfo = () => {
  const [batchInfo, setBatchInfo] = useState<StudentBatchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBatchInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const batch = await batchService.getStudentBatch();
        setBatchInfo(batch);
      } catch (err: any) {
        console.error('Error fetching batch info:', err);
        setError(err.message || 'Failed to load batch information');
      } finally {
        setLoading(false);
      }
    };

    fetchBatchInfo();
  }, []);

  return { batchInfo, loading, error, isAssigned: !!batchInfo };
};

export default useBatch;
