import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function JudgmentDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const judgment = location.state;

    if (!judgment) {
        return (
            <div className="p-6 text-center">
                <p>No data found. Please go back.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-full mx-2 p-6 bg-white rounded-xl shadow-md mt-6">
            <button
                onClick={() => navigate(-1)}
                className="text-white mb-4 bg-blue-950 py-2 px-3 rounded-md"
            >
                ← Back to Judgments
            </button>

            <h1 className="text-3xl font-bold mb-4 text-gray-900">
                {judgment.title}
            </h1>

            {judgment.decision_date && (
                <p className="text-sm text-gray-500 mb-2">
                    Decision Date:{" "}
                    {new Date(judgment.decision_date).toLocaleDateString()}
                </p>
            )}

            {judgment.judge && (
                <p className="text-gray-700 mb-2">
                    <strong>Judge:</strong> {judgment.judge}
                </p>
            )}

            {judgment.court_name && (
                <p className="text-gray-700 mb-2">
                    <strong>Court:</strong> {judgment.court_name}
                </p>
            )}

            {judgment.cnr && (
                <p className="text-gray-700 mb-2">
                    <strong>CNR No. :</strong> {judgment.cnr}
                </p>
            )}

            {judgment.date_of_registration && (
                <p className="text-gray-700 mb-2">
                    <strong>Registration Date:</strong> {judgment.date_of_registration}
                </p>
            )}

            {judgment.disposal_nature && (
                <p className="text-gray-700 mb-2">
                    <strong>Disposal:</strong> {judgment.disposal_nature}
                </p>
            )}

            {judgment.year && (
                <p className="text-gray-700 mb-2">
                    <strong>Year :</strong> {judgment.year}
                </p>
            )}

            {judgment.bench && (
                <p className="text-gray-700 mb-2">
                    <strong>Bench :</strong> {judgment.bench}
                </p>
            )}

            {judgment.pdf_link && (
                <p className="text-gray-700 mb-2">
                    <strong>PDF Link:</strong>{" "}
                    <a
                        href={judgment.pdf_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        View PDF
                    </a>
                </p>
            )}
        </div>
    );
}
