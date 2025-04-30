import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import type { MRT_ColumnDef } from "material-react-table";

// Updated JobData type to include all required fields
type JobData = {
  assignee: string;
  assigner: string;
  SourceID: string;
  WorkType: string;
  StatusString: string;
  PostDate: string;
  speciality: string;
  facility: string;
  facilityAddress: string;
  city: string;
  state: string;
  shift: string;
  weeks: number;
  billrate: number;
  startDate: string;
  endDate: string;
};

const Index = () => {
  const [data, setData] = useState<JobData[]>([]); // State to hold API data
  const [loading, setLoading] = useState<boolean>(true); // State to handle loading
  console.log("Data:", data); // Log the data to the console
  // Fetch data from the API

  const fetchData = async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      const requestOptions: any = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response: any = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/AHSA",
        requestOptions
      );

      const secondResponse: any = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/StaffingEngine",
        requestOptions
      );
      const secondResult: any = await secondResponse.json();
      // console.log("Second API Response:", secondResult); // Log the second API response to the console
      const result = await response.json();

      // console.log("API Response:", result); // Log the API response to the console
      const filteredData = result[0].filter(
        (item: JobData) => item.WorkType === "Perm"
      );
      const secondfilteredData = secondResult[0].filter(
        (item: JobData) => item.WorkType === "Permanent"
      );

      const combinedData = [...filteredData, ...secondfilteredData]; // Combine the two filtered data arrays
      console.log("Combined Data:", combinedData); // Log the combined data to the console
      // console.log("Filtered Data:", filteredData); // Log the filtered data to the console
      setData(combinedData); // Update state with filtered data
      setLoading(false); // Set loading to false
      // .then((response) => response.json())
      // .then((result) => {
      //   // Filter the data to include only items with WorkType === "Perm"
      //   const filteredData = result.filter(
      //     (item: JobData) => item.WorkType === "Perm"
      //   );
      //   console.log("Filtered Data:", filteredData); // Log the filtered data to the console

      //   setData(filteredData); // Update state with filtered data
      //   setLoading(false); // Set loading to false
      // })
      // .catch((error) => {
      //   console.error("Error fetching data:", error);
      //   setLoading(false); // Set loading to false even if there's an error
      // });
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };
  useEffect(() => {
    fetchData(); // Call the fetchData function
  }, []);

  // Updated columns definition with all required fields
  const columns = useMemo<MRT_ColumnDef<JobData>[]>(
    () => [
      { accessorKey: "sourceId", header: "Job-Id" },
      { accessorKey: "assigner", header: "Type" },
      { accessorKey: "SourceID", header: "VMS" },
      { accessorKey: "WorkType", header: "Status" },
      { accessorKey: "StatusString", header: "Open Position" },
      { accessorKey: "PostDate", header: "Profession" },
      { accessorKey: "speciality", header: "Speciality" },
      { accessorKey: "facility", header: "Facility" },
      { accessorKey: "facilityAddress", header: "Facility Address" },
      { accessorKey: "city", header: "City" },
      { accessorKey: "state", header: "State" },
      { accessorKey: "shift", header: "Shift" },
      { accessorKey: "weeks", header: "Weeks" },
      { accessorKey: "billrate", header: "Bill Rate" },
      { accessorKey: "startDate", header: "Start Date" },
      { accessorKey: "endDate", header: "End Date" },
    ],
    []
  );

  return (
    <div
      style={{
        display: "flex",

        height: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          width: "100%",

          backgroundColor: "#ffffff",
          padding: "20px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Permanent Jobs</h2>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <MaterialReactTable
            columns={columns}
            data={data}
            enableColumnResizing
            enableSorting
            enablePagination
            enableRowSelection
          />
        )}
      </div>
    </div>
  );
};

export default Index;
