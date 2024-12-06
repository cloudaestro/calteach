import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Worksheet {
  id: string;
  title: string;
  createdAt: Date;
  topic: string;
}

const MyWorksheets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worksheets, setWorksheets] = useState<Worksheet[]>([]);

  useEffect(() => {
    const fetchWorksheets = async () => {
      if (!user) return;
      
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
      
      setWorksheets(worksheetsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    };

    fetchWorksheets();
  }, [user]);

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

        <h1 className="text-3xl font-bold mb-6">My Worksheets</h1>

        <div className="grid gap-4">
          {worksheets.map((worksheet) => (
            <Card key={worksheet.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{worksheet.title}</CardTitle>
                <CardDescription>
                  Topic: {worksheet.topic} • Created: {worksheet.createdAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(`/crossword/${worksheet.id}`)}
                  variant="outline"
                >
                  Open Worksheet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyWorksheets;