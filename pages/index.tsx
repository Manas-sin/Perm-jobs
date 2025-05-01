import React, { useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import type { MRT_ColumnDef } from "material-react-table";
import { Box } from "@mui/material";
import { Button, Tooltip } from "@mui/material";

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
        ? thirdResult[0].filter(
            (item: JobData) => item.WorkType === "Direct Hire"
          )
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
    fetchData();
  }, []);

  // Updated columns definition with all required fields
  const columns = useMemo<MRT_ColumnDef<JobData>[]>(
    () => [
      {
        accessorFn: (row) => `${row.SourceID}`, //accessorFn used to join multiple data into a single cell
        id: "SourceID", //id is still required when using accessorFn instead of accessorKey
        header: "Job-Id",
        enableClickToCopy: true,
        enableHiding: true,
        enableColumnPinning: true, // Enable pinning for this column
        enableColumnActions: true,
        size: 95,
        Cell: ({ renderedCellValue, row }: any) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              fontSize: "12px",
              height: "25px",
            }}
          >
            <Tooltip title={renderedCellValue}>
              <span>{renderedCellValue}</span>
            </Tooltip>
          </Box>
        ),
      },
      {
        accessorKey: "WorkType",
        header: "Type",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "SourceName",
        header: "VMS",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "StatusString", //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
        enableClickToCopy: true,
        // filterVariant: "autocomplete",
        filterVariant: "multi-select",
        enableHiding: true,
        enableColumnPinning: true, // Enable pinning for this column
        enableColumnActions: true,
        header: "Status",
        size: 170,
        Cell: ({ renderedCellValue, row, cell }: any) => (
          <>
            <Box
              sx={(theme) => ({
                backgroundColor:
                  cell.getValue() === "Closed"
                    ? theme.palette.error.dark
                    : cell.getValue() === "On Hold"
                    ? "#ff9800"
                    : cell.getValue() === "Pending"
                    ? "#999999"
                    : cell.getValue() === "Interviews occurring"
                    ? "#03a9f4"
                    : cell.getValue() === "Cancelled"
                    ? "#ef5350"
                    : cell.getValue() === "Filled"
                    ? "#01579b"
                    : cell.getValue() === "Engagement Pending"
                    ? "#9c27b0"
                    : cell.getValue() === "Temp Block"
                    ? "#0000ff"
                    : theme.palette.success.main,
                    borderRadius: ".5rem", // Rounded corners
                    color: "rgb(255, 255, 255)", // White text color
                    fontSize: "12px", // Font size
                    height: "25px", // Fixed height
                    padding: "0.25rem", // Padding
                    textAlign: "center", // Center-align text
                    display: "flex", // Flexbox for centering content
                    alignItems: "center", // Vertically center content
                    justifyContent: "center", // Horizontally center content
                  })}
            >
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <Tooltip title={renderedCellValue}>
                <span>
                  {renderedCellValue === "O" ? "Open" : renderedCellValue}
                </span>
              </Tooltip>
            </Box>
            <span>
              {row.original.CustomField5 ? (
                <Tooltip title={row.original.CustomField5}>
                  <img
                    style={{ width: "17px", marginLeft: "5px" }}
                    src="https://img.icons8.com/?size=100&id=59825&format=png&color=000000"
                  />
                </Tooltip>
              ) : null}
              {row.original.AutoOffer_Fl &&
              row.original.AutoOffer_Fl == true ? (
                <>
                  <img
                    className="hotjobimage"
                    src="https://media.tenor.com/VUH3A7tK-qgAAAAi/dm4uz3-foekoe.gif"
                    style={{}}
                  />
                </>
              ) : (
                <></>
              )}
              {row.original.HotFL && row.original.HotFL == true ? (
                <>🌟</>
              ) : (
                <></>
              )}
            </span>
          </>
        ),
      },
      {
        accessorKey: "Positions",
        header: "Open Position",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "Degree",
        header: "Profession",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
      {
        accessorKey: "JobSpecialty",
        header: "Speciality",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "Facility",
        header: "Facility",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "Address",
        header: "Facility Address",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "City",
        header: "City",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "State",
        header: "State",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 100,
      },
      {
        accessorKey: "Shift",
        header: "Shift",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 150,
      },
      {
        accessorKey: "DurationWeeks",
        header: "Weeks",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 100,
      },
      {
        accessorKey: "BillRate",
        header: "Bill Rate",
        enableClickToCopy: true,
        filterVariant: "autocomplete",
        size: 90,
      },
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
        fontFamily: "Segoe UI", // Apply font family globally
        fontSize: "0.8rem", // Make font size smaller globally
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
            enableSorting
            enablePagination
            enableRowSelection
            enableGrouping
            initialState={{
              density: "compact",
            }}
            enableColumnActions
            enableColumnFilters
            enableColumnDragging={false}
            enableColumnResizing
            // Add grid lines to the entire table
            muiTableProps={{
              sx: {
                border: "0.1px solid rgba(224, 224, 224, 1)", // Outer border
                "& .MuiTableCell-root": {
                  fontSize: "0.75rem",
                  border: "1px solid rgba(224, 224, 224, 0.5)", // Cell borders
                },
              },
            }}
            muiTableHeadCellProps={{
              sx: {
                fontSize: "0.75rem",
                padding: "1px",
                fontWeight: "bold",
                border: "0.1px solid rgba(224, 224, 224, 0.5)", // Header cell borders
                backgroundColor: "#f5f5f5", // Light gray background for headers
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                fontSize: "0.75rem",
                padding: "1px",
                border: "0.1px solid rgba(224, 224, 224, 0.5)", // Body cell borders
              },
            }}
            muiTableContainerProps={{
              sx: {
                border: "1px solid rgba(224, 224, 224, 1)", // Container border
              },
            }}
            muiPaginationProps={{
              sx: {
                fontSize: "0.75rem",
              },
            }}
            muiTopToolbarProps={{
              sx: {
                fontSize: "0.75rem",
                "& .MuiButton-root": {
                  fontSize: "0.75rem",
                },
              },
            }}
            muiBottomToolbarProps={{
              sx: {
                fontSize: "0.75rem",
                "& .MuiButton-root": {
                  fontSize: "0.75rem",
                },
              },
            }}
            renderDetailPanel={({ row }: any) => (
              <div
                style={{
                  backgroundColor: "#f9f9f9",
                  border: "0.1px solid #ddd",
                  borderRadius: "1px",
                  fontFamily: "Segoe UI",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  padding: "1px",
                }}
              >
                <h4 style={{ fontSize: "0.875rem" }}>Job Description</h4>
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
