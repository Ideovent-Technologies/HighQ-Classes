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
  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "submitted", label: "Submitted" },
    { value: "graded", label: "Graded" },
    { value: "overdue", label: "Overdue" },
  ];

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="relative">
        <TabsList className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap p-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className="flex-1 min-w-[100px] sm:min-w-0 px-4 py-2 text-sm font-medium transition-colors hover:text-gray-900 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-full dark:hover:text-gray-50 dark:data-[state=active]:bg-gray-900 dark:data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <TabsContent value={filterStatus} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default AssignmentFilters;