import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from "material-react-table";
import { Box, Button, ListItemIcon, MenuItem, Typography, lighten, Tooltip } from "@mui/material";
import { AccountCircle, Send } from "@mui/icons-material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

type JobData = {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  salary: number;
  startDate: string;
  signatureCatchPhrase: string;
  avatar: string;
};

const Two = () => {
  const [data, setData] = useState<JobData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/mock-data"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = useMemo<MRT_ColumnDef<JobData>[]>(
    () => [
      {
        id: "employee",
        header: "Employee",
        columns: [
          {
            accessorFn: (row) => `${row.firstName} ${row.lastName}`,
            id: "name",
            header: "Name",
            size: 250,
            Cell: ({ renderedCellValue, row }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  alt="avatar"
                  height={30}
                  src={row.original.avatar}
                  loading="lazy"
                  style={{ borderRadius: "50%" }}
                />
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: "email",
            header: "Email",
            enableClickToCopy: true,
            filterVariant: "autocomplete",
            size: 300,
          },
        ],
      },
      {
        id: "jobInfo",
        header: "Job Info",
        columns: [
          {
            accessorKey: "salary",
            header: "Salary",
            size: 200,
            Cell: ({ cell }) => (
              <Box
                component="span"
                sx={(theme) => ({
                  backgroundColor:
                    cell.getValue<number>() < 50000
                      ? theme.palette.error.dark
                      : cell.getValue<number>() >= 50000 &&
                        cell.getValue<number>() < 75000
                      ? theme.palette.warning.dark
                      : theme.palette.success.dark,
                  borderRadius: "0.25rem",
                  color: "#fff",
                  maxWidth: "9ch",
                  p: "0.25rem",
                })}
              >
                {cell.getValue<number>()?.toLocaleString?.("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Box>
            ),
          },
          {
            accessorKey: "jobTitle",
            header: "Job Title",
            size: 350,
          },
          {
            accessorFn: (row) => new Date(row.startDate),
            id: "startDate",
            header: "Start Date",
            filterVariant: "date",
            filterFn: "lessThan",
            sortingFn: "datetime",
            Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(),
          },
        ],
      },
    ],
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        style={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#ffffff",
          fontFamily: "Segoe UI",
          fontSize: "0.8rem",
          overflowX: "hidden",
          overflowY: "auto",
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
          <h2 style={{ textAlign: "center", fontFamily: "monospace", fontSize: "1.5rem" }}>
            Employee Data
          </h2>
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading...</p>
          ) : (
            <MaterialReactTable
              columns={columns}
              data={data}
              enableColumnFilterModes
              enableColumnOrdering
              enableGrouping
              enableColumnPinning
              enableFacetedValues
              enableRowActions
              enableRowSelection
              initialState={{
                showColumnFilters: true,
                showGlobalFilter: true,
                columnPinning: {
                  left: ["mrt-row-expand", "mrt-row-select"],
                  right: ["mrt-row-actions"],
                },
              }}
              paginationDisplayMode="pages"
              positionToolbarAlertBanner="bottom"
              muiSearchTextFieldProps={{
                size: "small",
                variant: "outlined",
              }}
              muiPaginationProps={{
                color: "secondary",
                rowsPerPageOptions: [10, 20, 30],
                shape: "rounded",
                variant: "outlined",
              }}
              renderDetailPanel={({ row }) => (
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-around",
                    left: "30px",
                    maxWidth: "1000px",
                    position: "sticky",
                    width: "100%",
                  }}
                >
                  <img
                    alt="avatar"
                    height={200}
                    src={row.original.avatar}
                    loading="lazy"
                    style={{ borderRadius: "50%" }}
                  />
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4">Signature Catch Phrase:</Typography>
                    <Typography variant="h1">
                      &quot;{row.original.signatureCatchPhrase}&quot;
                    </Typography>
                  </Box>
                </Box>
              )}
              renderRowActionMenuItems={({ closeMenu }) => [
                <MenuItem
                  key={0}
                  onClick={() => {
                    alert("View Profile");
                    closeMenu();
                  }}
                >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  View Profile
                </MenuItem>,
                <MenuItem
                  key={1}
                  onClick={() => {
                    alert("Send Email");
                    closeMenu();
                  }}
                >
                  <ListItemIcon>
                    <Send />
                  </ListItemIcon>
                  Send Email
                </MenuItem>,
              ]}
            />
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Two;