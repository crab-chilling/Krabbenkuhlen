import { Card } from "../../types/card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import { useState, useEffect } from "react";

interface Props {
  cards: Array<Card>;
  onSelectCard?: (card: Card) => void;
  enableRowSelection?: boolean;
  onSelectionChange?: (selectedIds: number[]) => void;
}

export default function CardTable({
  cards,
  onSelectCard = () => {},
  enableRowSelection = false,
  onSelectionChange = () => {},
}: Props) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selection, setSelection] = useState<number[]>([]);

  useEffect(() => {
    onSelectionChange(selection);
  }, [selection, onSelectionChange]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectRow = (id: number) => {
    setSelection((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id],
    );
  };

  const isSelected = (id: number) => selection.includes(id);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "#ff6d4e", color: "#ffffff" }}>
            <TableRow>
              {enableRowSelection && <TableCell padding="checkbox"></TableCell>}
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
                  selected={isSelected(card.id)}
                >
                  {enableRowSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected(card.id)}
                        onChange={() => handleSelectRow(card.id)}
                      />
                    </TableCell>
                  )}
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
