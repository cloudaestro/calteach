import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface SavedWorksheet {
  id: string;
  title: string;
  worksheetId: string;
  createdAt: Date;
}

const MyWorksheets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worksheets, setWorksheets] = useState<SavedWorksheet[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchWorksheets = async () => {
      const q = query(
        collection(db, "savedWorksheets"),
        where("userId", "==", user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const worksheetsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      })) as SavedWorksheet[];

      setWorksheets(worksheetsData.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      ));
    };

    fetchWorksheets();
  }, [user, navigate]);

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

        <h1 className="text-3xl font-bold mb-8">My Saved Worksheets</h1>

        <div className="grid gap-4">
          {worksheets.map((worksheet) => (
            <div
              key={worksheet.id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{worksheet.title}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Saved on: {worksheet.createdAt.toLocaleDateString()}
              </p>
              <Button
                onClick={() => navigate(`/crossword/${worksheet.worksheetId}`)}
              >
                Open Worksheet
              </Button>
            </div>
          ))}

          {worksheets.length === 0 && (
            <p className="text-center text-gray-500">
              You haven't saved any worksheets yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWorksheets;