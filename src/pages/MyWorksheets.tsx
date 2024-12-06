import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      if (!user) return;

      try {
        const q = query(
          collection(db, "worksheets"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const worksheetsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        })) as Worksheet[];

        setWorksheets(worksheetsData.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        ));
      } catch (error) {
        console.error("Error fetching worksheets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorksheets();
  }, [user]);

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
          <div>Loading...</div>
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
                <h3 className="font-semibold mb-2">{worksheet.title}</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Created: {worksheet.createdAt.toLocaleDateString()}
                </p>
                <Button
                  onClick={() => navigate(`/crossword/${worksheet.puzzleId}`)}
                >
                  Open Worksheet
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWorksheets;