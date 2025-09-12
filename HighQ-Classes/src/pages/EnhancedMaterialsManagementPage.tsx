import React, { useEffect, useState, useMemo } from "react";
import MaterialsService, { Material } from "@/API/services/admin/materials.service";
import styled from 'styled-components';

// Styled Components (same as before)
const PageContainer = styled.div`
  max-width: 1300px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f9fafb;
  border-radius: 15px;
  box-shadow: 0 6px 30px rgba(0, 0, 0, 0.08);
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 30px;
  h1 { font-size: 2.5rem; color: #1f2937; margin-bottom: 5px; font-weight: 700; }
  p { color: #6b7280; font-size: 1rem; }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 25px;
  gap: 12px;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const SortSelect = styled.select`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  background-color: #fff;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const MaterialCard = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: 20px;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
    border-color: #3b82f6;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #ef4444;
  border: none;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #b91c1c; }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: #111827;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardDescription = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.4;
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: 16px;
  border-top: 1px solid #e5e7eb;
  padding-top: 14px;
`;

const FileLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  &:hover { color: #1e40af; }
`;

const SkeletonCard = styled.div`
  height: 200px;
  background-color: #e5e7eb;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 150%;
    height: 100%;
    background: linear-gradient(to right, #e5e7eb 0%, #f3f4f6 50%, #e5e7eb 100%);
    animation: loading 1.5s infinite;
  }
  @keyframes loading {
    to { left: 100%; }
  }
`;

const ErrorMessage = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: #fee2e2;
  color: #b91c1c;
  text-align: center;
  font-weight: 500;
  border: 1px solid #fca5a5;
  margin: 20px 0;
`;

const EnhancedMaterialsManagementPage: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("latest");

    const fetchMaterials = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await MaterialsService.getAdminTeacherMaterials();
            if (response.success) {
                setMaterials(response.data || []);
            } else {
                setError(response.message || "Failed to fetch materials.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setError("Something went wrong while fetching materials. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMaterials(); }, []);

   const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;
    try {
        const response = await MaterialsService.deleteMaterial(id);
        if (response.success) {
            setMaterials(prev => prev.filter(mat => mat._id !== id));
            alert("Material deleted successfully!");
        } else {
            alert(response.message || "Failed to delete material.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the material.");
    }
};

    const filteredMaterials = useMemo(() => {
        let result = materials.filter(m =>
            m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (sortOption === "latest") {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortOption === "mostViewed") {
            result.sort((a, b) => (b.viewedBy?.length || 0) - (a.viewedBy?.length || 0));
        }
        return result;
    }, [materials, searchTerm, sortOption]);

    const renderSkeletons = () => Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />);

    return (
        <PageContainer>
            <Header>
                <h1>Materials Management</h1>
                <p>Manage and explore all uploaded educational materials.</p>
            </Header>

            <Controls>
                <SearchInput
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SortSelect value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="latest">Sort by Latest</option>
                    <option value="mostViewed">Sort by Most Viewed</option>
                </SortSelect>
            </Controls>

            {loading ? (
                <GridContainer>{renderSkeletons()}</GridContainer>
            ) : error ? (
                <ErrorMessage>{error}</ErrorMessage>
            ) : (
                <GridContainer>
                    {filteredMaterials.length > 0 ? (
                        filteredMaterials.map((material) => (
                            <MaterialCard key={material._id}>
                                <DeleteButton onClick={() => handleDelete(material._id)}>Delete</DeleteButton>
                                <CardTitle title={material.title}>{material.title}</CardTitle>
                                <CardDescription>{material.description}</CardDescription>
                                <CardInfo>
                                    <FileLink href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                                        <span>📎 {material.originalFileName}</span>
                                    </FileLink>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        👁️ <span>{material.viewedBy?.length || 0} views</span>
                                    </div>
                                </CardInfo>
                                <small style={{ display: 'block', textAlign: 'right', marginTop: '10px', color: '#9ca3af' }}>
                                    Uploaded: {new Date(material.createdAt || "").toLocaleDateString()}
                                </small>
                            </MaterialCard>
                        ))
                    ) : (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6b7280' }}>
                            No materials match your search.
                        </p>
                    )}
                </GridContainer>
            )}
        </PageContainer>
    );
};

export default EnhancedMaterialsManagementPage;
