import React, { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { assets, viewApplicationsPageData } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ViewApplications = () => {
  const { backendUrl, companyToken } = useContext(AppContext);

  const [applicants, setApplicants] = useState(false);

  // Function to Fetch Company job Application Data
  const fetchCompanyJobApplications = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/company/applicants", {
        headers: { token: companyToken },
      });

      if (data.success) {
        setApplicants(data.applications.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch applicants");
    }
  };

  // Function to Download Resume
  const downloadResume = async (userId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/company/resume/${userId}`, {
        headers: { token: companyToken },
        responseType: 'blob', // Important for downloading files
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/company/change-status`,
        { id, status },
        { headers: { token: companyToken } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCompanyJobApplications();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  useEffect(() => {
    if (companyToken) {
      fetchCompanyJobApplications();
    }
  }, [companyToken]);

  return applicants ? (
    applicants.length === 0 ? (
      <div></div>
    ) : (
      <div className="container p-4 mx-auto">
        <div>
          <table className="w-full max-w-4xl bg-white border-gray-200 max-sm:text-sm">
            <thead>
              <tr className="border-b-0">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">User Name</th>
                <th className="px-4 py-2 text-left max-sm:hidden">Job Title</th>
                <th className="px-4 py-2 text-left max-sm:hidden">Location</th>
                <th className="px-4 py-2 text-left">Resume</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applicants
                .filter((item) => item.jobId && item.userId)
                .map((applicant, index) => (
                  <tr key={index} className="text-gray-700">
                    <td className="px-4 py-2 text-center border-b">
                      {index + 1}
                    </td>
                    <td className="flex items-center justify-center px-4 py-2 text-center border-b">
                      <img
                        className="w-10 h-10 mr-3 rounded-full max-sm:hidden"
                        src={applicant.userId.image}
                        alt=""
                      />
                      <span>{applicant.userId.name}</span>
                    </td>
                    <td className="px-4 py-2 border-b max-sm:hidden">
                      {applicant.jobId.title}
                    </td>
                    <td className="px-4 py-2 border-b max-sm:hidden">
                      {applicant.jobId.location}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() => downloadResume(applicant.userId._id)}
                        className="inline-flex items-center gap-2 px-3 py-1 text-blue-400 bg-blue-50 hover:bg-blue-100"
                      >
                        Download Resume <img src={assets.resume_download_icon} alt="" />
                      </button>
                    </td>
                    <td className="px-4 py-2 border-b">
                      {applicant.status === "Pending" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => changeJobApplicationStatus(applicant._id, "Accepted")}
                            className="px-3 py-1 text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => changeJobApplicationStatus(applicant._id, "Rejected")}
                            className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="font-semibold">{applicant.status}</div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  ) : (
    <Loading />
  );
};

export default ViewApplications;
