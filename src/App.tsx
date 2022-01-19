import React from 'react'
import { ResultsTable } from './ResultsTable'
import { Form } from './Form'
import { Container, Typography } from '@mui/material'
import { Repository } from './client'
import Alert from '@mui/material/Alert';

export const App = () => {
  const [repositories, setRepositories] = React.useState<Repository[]>([])
  const [error, setError] = React.useState("")
  const [page, setPage] = React.useState(1)

  return (
    <Container sx={{ mt: '10%' }}>
      <Typography variant="h2">Repository Explorer</Typography>
      <Form setRepositories={setRepositories} setError={setError} error={error}
        setPage={setPage}
      /> 

      {
        !!error ? (<Alert sx={{ mt: 4 }} severity="error">{error}</Alert>)
        : (<ResultsTable page={page} setPage={setPage} repositories={repositories}/>)
      }
    </Container>
  )
}
