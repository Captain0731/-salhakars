import { useParams } from "react-router-dom";

export default function CaseDetail() {
  const { cnr } = useParams(); // get CNR from URL

  // TODO: Fetch case details from API or local data using the CNR
  // Example placeholder data
  const caseData = {
    title: "Example Case Title",
    date: "2025-10-05",
    status: "Pending",
    description: "This is a sample description for the case with CNR " + cnr,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Case Details: {cnr}</h1>
      <p><strong>Title:</strong> {caseData.title}</p>
      <p><strong>Date:</strong> {caseData.date}</p>
      <p><strong>Status:</strong> {caseData.status}</p>
      <p><strong>Description:</strong> {caseData.description}</p>
    </div>
  );
}
