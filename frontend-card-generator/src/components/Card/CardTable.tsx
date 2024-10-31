import { Card } from "../../types/card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { useState } from "react";

interface Props {
  cards: Array<Card>;
  onSelectCard: Function;
}

export default function CardTable({ cards, onSelectCard }: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#ff6d4e", color: "#ffffff" }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Family</TableCell>
              <TableCell>Affinity</TableCell>
              <TableCell>Energy</TableCell>
              <TableCell>HP</TableCell>
              <TableCell>Defence</TableCell>
              <TableCell>Attack</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cards
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((card) => (
                <TableRow
                  key={card.id}
                  onClick={() => onSelectCard(card)}
                  hover
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell>{card.id}</TableCell>
                  <TableCell>{card.name}</TableCell>
                  <TableCell>{card.family}</TableCell>
                  <TableCell>{card.affinity}</TableCell>
                  <TableCell>{card.energy.toFixed(2)}</TableCell>
                  <TableCell>{card.hp.toFixed(2)}</TableCell>
                  <TableCell>{card.defence.toFixed(2)}</TableCell>
                  <TableCell>{card.attack.toFixed(2)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={cards.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
