import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import logo from '../../assets/logo.png'; // Assuming you have a logo
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const HRPayslipViewPage = () => {
  const { payslipId } = useParams();
  const [payslip, setPayslip] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const payslipRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      if (!payslipId) {
        setError('No payslip ID provided.');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const payslipDocRef = doc(db, 'payslips', payslipId);
        const payslipDoc = await getDoc(payslipDocRef);

        if (payslipDoc.exists()) {
          const payslipData = { ...payslipDoc.data(), id: payslipDoc.id };
          setPayslip(payslipData);

          const employeeDocRef = doc(db, 'employees', payslipData.employeeId);
          const employeeDoc = await getDoc(employeeDocRef);

          if (employeeDoc.exists()) {
            setEmployee({ ...employeeDoc.data(), id: employeeDoc.id });
          } else {
            setError('Employee not found for this payslip.');
          }
        } else {
          setError('Payslip not found.');
        }
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [payslipId]);

  const handleDownloadPdf = () => {
    const input = payslipRef.current;
    
    const cssOverride = `
        <style>
            .bg-gray-100 { background-color: #f3f4f6 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-green-600 { color: #16a34a !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-red-500 { color: #ef4444 !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .bg-white { background-color: #ffffff !important; }
        </style>
    `;

    html2canvas(input, {
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
            clonedDoc.head.innerHTML += cssOverride;
        }
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const pdfHeight = pdfWidth / ratio;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Payslip-${employee?.name}-${payslip?.month}-${payslip?.year}.pdf`);
    }).catch(err => {
        console.error("Error generating PDF:", err);
        alert("Could not generate PDF. Please try again.");
    });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading Payslip...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">Error: {error}</div>;
  if (!payslip || !employee) return <div className="flex justify-center items-center min-h-screen">No Payslip Data Found.</div>;

  const { grossSalary, deductions, netSalary, deductionDetails = [] } = payslip;
  const earnings = [{ name: 'Base Salary', amount: grossSalary }];
  const payslipDate = payslip.generatedAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'N/A';

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4 gap-4">
            <button onClick={handleDownloadPdf} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <FaDownload />
                <span>Download PDF</span>
            </button>
        </div>
        <div ref={payslipRef} className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-200 pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Payslip</h1>
              <p className="text-gray-500">For {payslip.month}, {payslip.year}</p>
              <p className="text-gray-500">Payslip Date: {payslipDate}</p>
            </div>
            <div className="flex items-center">
              <img src={logo} alt="Company Logo" className="h-16 w-auto" />
            </div>
          </div>

          {/* Employee Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Employee Details</h3>
              <p className="text-gray-600"><strong>Name:</strong> {employee.name}</p>
              <p className="text-gray-600"><strong>Designation:</strong> {employee.designation || 'N/A'}</p>
              <p className="text-gray-600"><strong>Joining Date:</strong> {employee.joiningDate || 'N/A'}</p>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Company Details</h3>
                <p className="text-gray-600">Payroll Management Inc.</p>
                <p className="text-gray-600">123 Business Rd, Suite 100</p>
                <p className="text-gray-600">Business City, 12345</p>
            </div>
          </div>

          {/* Earnings and Deductions */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Earnings */}
            <div>
              <h3 className="text-xl font-semibold text-green-600 border-b border-gray-200 pb-2 mb-4">Earnings</h3>
              {earnings.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-800 font-medium">${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            {/* Deductions */}
            <div>
              <h3 className="text-xl font-semibold text-red-600 border-b border-gray-200 pb-2 mb-4">Deductions</h3>
              {deductionDetails.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{item.name}</span>
                  <span className="text-gray-800 font-medium">-${item.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-gray-500 uppercase tracking-wider text-sm">Gross Earnings</p>
                    <p className="text-2xl font-bold text-gray-800">${grossSalary.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-gray-500 uppercase tracking-wider text-sm">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-500">-${deductions.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-green-600">${netSalary.toFixed(2)}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRPayslipViewPage;
