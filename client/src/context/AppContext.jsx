import React, { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { user } = useUser();
  const { getToken } = useAuth();

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);

  const [jobs, setJobs] = useState([]);

  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/jobs");

      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast.error(data.message);
        setJobs(jobsData);
      }
    } catch (error) {
      toast.error(error.message);
      setJobs(jobsData);
    }
  };

  // Fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/company/company",
        { headers: { token: companyToken } }
      );

      if (data.success) {
        setCompanyData(data.company);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // Fetch user data (with retry for Clerk webhook delay)
  const fetchUserData = async (retryCount = 0, maxRetries = 8) => {

    try {

      const token = await getToken();
      
      if (!token) {
        console.log('No token available, retrying...');
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          return await fetchUserData(retryCount + 1, maxRetries);
        }
        return null;
      }

      const { data } = await axios.get(
        backendUrl + "/api/user/user",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        console.log('User data loaded successfully');
        setUserData(data.user);
        return data.user;

      } else {
        console.log('User not found in database:', data.message, 'retrying...');
        if (retryCount < maxRetries) {
          // Retry if webhook hasn't created user yet
          await new Promise(resolve => setTimeout(resolve, 1500));
          return await fetchUserData(retryCount + 1, maxRetries);
        }
      }

      return null;

    } catch (error) {
      console.log('Error fetching user data:', error.message);
      if (retryCount < maxRetries) {
        // Retry on network errors too
        await new Promise(resolve => setTimeout(resolve, 1500));
        return await fetchUserData(retryCount + 1, maxRetries);
      }

      return null;

    }

  };

  // Fetch user applications
  const fetchUserApplications = async () => {

    try {

      const token = await getToken();

      const { data } = await axios.get(
        backendUrl + "/api/user/applications",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {

        setUserApplications(data.applications);

      } else {

        toast.error(data.message);

      }

    } catch (error) {

      toast.error(error.message);

    }

  };

  // Initial load
  useEffect(() => {

    fetchJobs();

    const storedCompanyToken = localStorage.getItem("companyToken");

    if (storedCompanyToken) {
      setCompanyToken(storedCompanyToken);
    }

  }, []);

  // Company data
  useEffect(() => {

    if (companyToken) {
      fetchCompanyData();
    }

  }, [companyToken]);

  // User login / logout handling
  useEffect(() => {

    if (user) {

      fetchUserData();
      fetchUserApplications();

    } else {

      setUserData(null);
      setUserApplications([]);

    }

  }, [user]);

  const value = {

    user,

    searchFilter,
    setSearchFilter,

    isSearched,
    setIsSearched,

    jobs,
    setJobs,

    showRecruiterLogin,
    setShowRecruiterLogin,

    companyToken,
    setCompanyToken,

    companyData,
    setCompanyData,

    backendUrl,

    userData,
    setUserData,

    userApplications,
    setUserApplications,

    fetchUserData,
    fetchUserApplications

  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );

};
