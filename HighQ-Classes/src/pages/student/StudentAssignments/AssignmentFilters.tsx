import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  children: React.ReactNode;
}

const AssignmentFilters: React.FC<Props> = ({
  filterStatus,
  setFilterStatus,
  children,
}) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        {["all", "pending", "submitted", "graded", "overdue"].map((s) => (
          <TabsTrigger key={s} value={s} onClick={() => setFilterStatus(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={filterStatus} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default AssignmentFilters;
