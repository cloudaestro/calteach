import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Grid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Worksheet {
  id: string;
  title: string;
  createdAt: any;
  topic: string;
}

const MyWorksheets = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorksheets = async () => {
      if (!auth.currentUser) {
        navigate("/login");
        return;
      }

      try {
        const q = query(
          collection(db, "worksheets"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const worksheetData: Worksheet[] = [];
        querySnapshot.forEach((doc) => {
          worksheetData.push({ id: doc.id, ...doc.data() } as Worksheet);
        });
        setWorksheets(worksheetData.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error("Error fetching worksheets:", error);
        toast({
          title: "Error",
          description: "Failed to load worksheets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheets();
  }, [navigate, toast]);

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

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">My Worksheets</h1>
          
          {loading ? (
            <div>Loading...</div>
          ) : worksheets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-600">No worksheets found</p>
              <Button 
                className="mt-4"
                onClick={() => navigate("/crossword")}
              >
                Create New Worksheet
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worksheets.map((worksheet) => (
                <Card key={worksheet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Grid className="w-5 h-5 text-primary" />
                      {worksheet.title || `Crossword: ${worksheet.topic}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 mb-4">
                      Topic: {worksheet.topic}
                    </p>
                    <Button 
                      onClick={() => navigate(`/crossword/${worksheet.id}`)}
                      className="w-full"
                    >
                      Open Worksheet
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWorksheets;