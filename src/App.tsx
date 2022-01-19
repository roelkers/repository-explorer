import React from 'react'
import { ResultsTable } from './ResultsTable'
import { Form } from './Form'
import { User } from './client'
import { Container, ThemeProvider, Typography } from '@mui/material'
import { Repository } from './client'
import {theme} from './theme'
import Alert from '@mui/material/Alert';

export const App = () => {
  const [repositories, setRepositories] = React.useState<Repository[]>([])
  const [error, setError] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [organization, setOrganization] = React.useState<User | null>(null)

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: '10%' }}>
        <Typography variant="h2">Repository Explorer</Typography>
        <Form setRepositories={setRepositories} setError={setError} error={error}
          setPage={setPage} organization={organization} setOrganization={setOrganization}
        /> 

        {
          !!error ? (<Alert sx={{ mt: 4 }} severity="error">{error}</Alert>)
          : (<ResultsTable page={page} setPage={setPage} repositories={repositories} 
             organization={organization}/>)
        }
      </Container>
    </ThemeProvider>
  )
}
