import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Worksheet {
  id: string;
  title: string;
  createdAt: string;
  type: string;
}

const WorksheetList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [worksheetToDelete, setWorksheetToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadWorksheets();
  }, []);

  const loadWorksheets = () => {
    const allKeys = Object.keys(localStorage);
    const worksheetKeys = allKeys.filter(key => key.startsWith('crossword-'));
    const worksheetList = worksheetKeys.map(key => {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      return {
        id: key.replace('crossword-', ''),
        title: data.topic || 'Untitled Worksheet',
        createdAt: new Date().toLocaleDateString(),
        type: 'Crossword'
      };
    });
    setWorksheets(worksheetList);
  };

  const handleDelete = (id: string) => {
    localStorage.removeItem(`crossword-${id}`);
    loadWorksheets();
    toast({
      title: "Worksheet Deleted",
      description: "The worksheet has been successfully deleted.",
    });
    setWorksheetToDelete(null);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Worksheets</h1>
          <Button onClick={() => navigate('/crossword')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Worksheet
          </Button>
        </div>

        {worksheets.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-neutral-600">No worksheets saved yet. Create your first worksheet!</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {worksheets.map((worksheet) => (
              <Card key={worksheet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    {worksheet.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-neutral-600">
                      Created: {worksheet.createdAt}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Type: {worksheet.type}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/crossword/${worksheet.id}`)}
                      >
                        Open
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => setWorksheetToDelete(worksheet.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AlertDialog open={!!worksheetToDelete} onOpenChange={() => setWorksheetToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Worksheet</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this worksheet? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => worksheetToDelete && handleDelete(worksheetToDelete)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default WorksheetList;