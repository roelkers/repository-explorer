import { Dispatch, SetStateAction } from 'react'
import { Repository } from './client'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Pagination } from '@mui/material';
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { User } from './client'

interface ResultsTableProps {
  repositories: Repository[]
  setPage: Dispatch<SetStateAction<number>> 
  page: number;
  organization: User | null;
}

const PAGE_SIZE = 10

export const ResultsTable = ({ organization, repositories, setPage, page }: ResultsTableProps) => {
  const pageCount = Math.ceil(repositories.length / PAGE_SIZE);
  if(!organization) {
    return null
  }
  if(repositories.length === 0) {
    return <Typography sx={{ mt: 4}}variant="h5" >No repositories were found matching the filters.</Typography> 
  }
  const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }
  return (
    <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" >
    <TableContainer component={Paper} sx={{ mt: 4}}>
      <Table sx={{ minWidth: 450 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Repository Name</TableCell>
            <TableCell align="right">Star Count</TableCell>
            <TableCell align="right">Open Issues</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {repositories
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice((page -1) * PAGE_SIZE, page * PAGE_SIZE)
          .map((repository: Repository) => (
            <TableRow
              key={repository.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {repository.name}
              </TableCell>
              <TableCell align="right">{repository.stargazers_count}</TableCell>
              <TableCell align="right">{repository.open_issues_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Pagination 
      sx={{ my: 4}} 
      variant="outlined" 
      page={page} 
      count={pageCount} 
      onChange={handleChangePagination} />
    </Box>
  )
}
