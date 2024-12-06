import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Worksheet {
  id: string;
  title: string;
  createdAt: Date;
  puzzleId: string;
}

const MyWorksheets = () => {
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorksheets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching worksheets for user:", user.uid);
        const q = query(
          collection(db, "worksheets"),
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        console.log("Fetched worksheets:", querySnapshot.size);
        
        const worksheetsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Worksheet[];

        worksheetsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        console.log("Processed worksheets:", worksheetsData);
        setWorksheets(worksheetsData);
      } catch (error) {
        console.error("Error fetching worksheets:", error);
        toast.error("Failed to load worksheets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheets();
  }, [user]);

  const handleDelete = async (worksheetId: string) => {
    try {
      await deleteDoc(doc(db, "worksheets", worksheetId));
      setWorksheets(prev => prev.filter(worksheet => worksheet.id !== worksheetId));
      toast.success("Worksheet deleted successfully");
    } catch (error) {
      console.error("Error deleting worksheet:", error);
      toast.error("Failed to delete worksheet. Please try again later.");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">My Worksheets</h1>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : worksheets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-600">No worksheets saved yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/crossword")}
            >
              Create New Worksheet
            </Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {worksheets.map((worksheet) => (
              <div 
                key={worksheet.id}
                className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold mb-2">{worksheet.title}</h3>
                    <p className="text-sm text-neutral-600 mb-4">
                      Created: {worksheet.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/crossword/${worksheet.puzzleId}`)}
                    >
                      Open Worksheet
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Worksheet</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this worksheet? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(worksheet.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorksheets;