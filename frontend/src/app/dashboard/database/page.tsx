"use client"

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

import { studentsData, classesData, usersData } from "@/lib/dummyData";
import { columns } from "@/components/ui/columns";
import { columnsClasses } from "@/components/ui/columns-classes";
import { columnsUsers } from "@/components/ui/columns-users";

import AddStudentModal from "@/components/custom/AddStudentModal";
import AddClassModal from "@/components/custom/AddClassModal";
import AddUserModal from "@/components/custom/AddUserModal";

function Database() {
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState("students");
  const [editingData, setEditingData] = useState<any>(null);

  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"student" | "class" | "user" | null>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setKeyword("");
  };

  const handleAddClick = () => {
    setEditingData(null);
    if (activeTab === "students") setIsAddStudentOpen(true);
    else if (activeTab === "classes") setIsAddClassOpen(true);
    else if (activeTab === "users") setIsAddUserOpen(true);
  };

  const confirmDelete = () => {
    console.log(`MENGHAPUS ${deleteType?.toUpperCase()} ID:`, deleteId);
    setIsDeleteOpen(false);
    setDeleteId(null);
  };

  const handleClearSearch = () => {
    setKeyword("");
  };

  return (
    <div className="shadcn-default px-[20px] h-screen flex flex-col overflow-hidden">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex flex-col flex-1 overflow-hidden">
        <div className="flex w-full h-fit gap-[20px] py-[20px] items-center">
          <div className="flex w-fit h-fit">
            <TabsList className="h-12">
              <TabsTrigger value="students" className="h-full gap-2 px-6">
                <Icon icon="mdi:account" width={24} height={24} /> Students
              </TabsTrigger>
              <TabsTrigger value="classes" className="h-full gap-2 px-6">
                <Icon icon="ic:baseline-class" width={24} height={24} /> Classes
              </TabsTrigger>
              <TabsTrigger value="users" className="h-full gap-2 px-6">
                <Icon icon="lucide:user-cog" width={24} height={24} /> Users
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex w-full h-fit">
            <div className="relative w-full max-w-[400px]">
              <Input
                placeholder={`Search in ${activeTab}`}
                className="pr-[40px] h-12"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Icon
                icon={keyword ? "material-symbols:close" : "material-symbols:search"}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground ${keyword && 'cursor-pointer'}`}
                width={20}
                onClick={() => keyword && setKeyword("")}
              />
            </div>
          </div>

          <Button onClick={handleAddClick} className="h-12 px-6 gap-2">
            <Icon icon="gridicons:add" width={20} />
            Add {activeTab === "students" ? "student" : activeTab === "classes" ? "class" : "user"}
          </Button>
        </div>

        <TabsContent value="students" className="mt-0 flex-1 overflow-auto no-scrollbar">
          <DataTable
            columns={columns}
            data={studentsData}
            filterValue={keyword}
            meta={{
              onEdit: (data: any) => {
                setEditingData(data);
                setIsAddStudentOpen(true);
              },
              onDelete: (id: string) => {
                setDeleteId(id);
                setDeleteType("student");
                setIsDeleteOpen(true);
              },
              onClearSearch: () => setKeyword("")
            }}
          />
        </TabsContent>

        <TabsContent value="classes" className="mt-0 flex-1 overflow-auto no-scrollbar">
          <DataTable
            columns={columnsClasses}
            data={classesData}
            filterValue={keyword}
            meta={{
              onEdit: (data: any) => {
                setEditingData(data);
                setIsAddClassOpen(true);
              },
              onDelete: (id: string) => {
                setDeleteId(id);
                setDeleteType("class");
                setIsDeleteOpen(true);
              },
              onClearSearch: () => setKeyword("")
            }}
          />
        </TabsContent>

        <TabsContent value="users" className="mt-0 flex-1 overflow-auto no-scrollbar">
          <DataTable columns={columnsUsers} data={usersData} filterValue={keyword} meta={{
            onEdit: (data: any) => {
              setEditingData(data);
              setIsAddUserOpen(true);
            },
            onDelete: (id: string) => {
              setDeleteId(id);
              setDeleteType("user");
              setIsDeleteOpen(true);
            },
            onClearSearch: () => setKeyword("")
          }} />
        </TabsContent>

        <AddStudentModal isOpen={isAddStudentOpen} onClose={() => setIsAddStudentOpen(false)} initialData={editingData} />
        <AddClassModal isOpen={isAddClassOpen} onClose={() => setIsAddClassOpen(false)} initialData={editingData} />
        <AddUserModal isOpen={isAddUserOpen} onClose={() => setIsAddUserOpen(false)} initialData={editingData} />

        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the {deleteType} data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-12 px-6">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-12 px-6">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Tabs>
    </div>
  );
}

export default Database;