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
  
      const response = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/AHSA",
        requestOptions
      );
      const secondResponse = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/StaffingEngine",
        requestOptions
      );
      const thirdResponse = await fetch(
        "https://api.theartemis.ai/api/allvms/dumpByVMS/Focusone",
        requestOptions
      );
  
      if (!thirdResponse.ok) {
        console.error("Error fetching third API:", thirdResponse.statusText);
        return;
      }
  
      const result = await response.json();
      const secondResult = await secondResponse.json();
      const thirdResult = await thirdResponse.json();
  
      console.log("Third API Response:", thirdResult); // Debug third API response
  
      const filteredData = result[0].filter(
        (item: JobData) => item.WorkType === "Perm"
      );
      const secondFilteredData = secondResult[0].filter(
        (item: JobData) => item.WorkType === "Permanent"
      );
      const thirdFilteredData = Array.isArray(thirdResult[0])
        ? thirdResult[0].filter((item: JobData) => item.WorkType === "Direct Hire")
        : [];
  
      console.log("Filtered Data from Third API:", thirdFilteredData); // Debug filtered data
  
      const combinedData = [
        ...filteredData,
        ...secondFilteredData,
        ...thirdFilteredData,
      ];
  
      console.log("Combined Data:", combinedData); // Debug combined data
      setData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData(); // Call the fetchData function
  }, []);

  // Updated columns definition with all required fields
  const columns = useMemo<MRT_ColumnDef<JobData>[]>(
    () => [
      { accessorKey: "WorkType", header: "Type" },
      { accessorKey: "SourceName", header: "VMS" },
      { accessorKey: "StatusString", header: "Status" },
      { accessorKey: "Positions", header: "Open Position" },
      { accessorKey: "Degree", header: "Profession" },
      { accessorKey: "JobSpecialty", header: "Speciality" },
      { accessorKey: "Facility", header: "Facility" },
      { accessorKey: "Address", header: "Facility Address" },
      { accessorKey: "City", header: "City" },
      { accessorKey: "State", header: "State" },
      { accessorKey: "Shift", header: "Shift" },
      { accessorKey: "DurationWeeks", header: "Weeks" },
      { accessorKey: "BillRate", header: "Bill Rate" },
      {
        accessorKey: "StartDate",
        header: "Start Date",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          if (!value) return " "; // Handle empty or invalid dates
          const date = new Date(value);
          if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date strings
          return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
        },
      },
      {
        accessorKey: "EndDate",
        header: "End Date",
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          if (!value) return " "; // Handle empty or invalid dates
          const date = new Date(value);
          if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid date strings
          return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
        },
      },
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
            enableGrouping // Enable grouping feature
            initialState={{
              density: "comfortable", // Set default density to comfortable
            }}
            enableColumnActions // Enable column actions menu
            enableColumnFilters // Enable column filters
            renderDetailPanel={({ row }: any) => (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <h4>Job Description</h4>
                <div
                  dangerouslySetInnerHTML={{
                    __html: row.original.Note || "No description available.",
                  }}
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
