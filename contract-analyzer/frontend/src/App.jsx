import { useState, useEffect } from "react";
import UploadPage from "./pages/UploadPage";
import AnalysisPage from "./pages/AnalysisPage";
import ReviewerPage from "./pages/ReviewerPage";

export default function App() {
  const [contractId, setContractId] = useState(null);
  const [currentPage, setCurrentPage] = useState("upload");

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#reviewer") {
        setCurrentPage("reviewer");
      } else {
        setCurrentPage("upload");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Check on load

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (currentPage === "reviewer") {
    return <ReviewerPage />;
  }

  return contractId ? (
    <AnalysisPage contractId={contractId} />
  ) : (
    <UploadPage onUpload={setContractId} />
  );
}