import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { Box, CircularProgress, TextField } from '@mui/material'
import { Repository } from './client'
import { Button } from '@mui/material';

import { OrganizationSearchField } from './OrganizationSearchField'
import { searchRepositories, User } from './client'

import debouncePromise from 'awesome-debounce-promise'

const debouncedSearchRepos = debouncePromise(searchRepositories, 200)

interface FormProps {
  setRepositories: Dispatch<SetStateAction<Repository[]>>
  setError: Dispatch<SetStateAction<string>>
  error: string;
  setPage: Dispatch<SetStateAction<number>> 
}

export const Form = ({ setRepositories, error, setError, setPage }: FormProps) => {
  const [organization, setOrganization] = React.useState<User | null>(null)
  const [minIssues, setMinIssues] = React.useState<number | null>(null)
  const [maxIssues, setMaxIssues] = React.useState<number | null>(null)
  const [repositoryName, setRepositoryName] = React.useState("")
  const [rawResults, setRawResults] = React.useState<Repository[]>([]);
  const [loading, setLoading] = React.useState(false)
  const [repositoryError, setRepositoryError] = React.useState(false)
  const [retry, setRetry] = React.useState(false)
  const [userError, setUserError] = React.useState(false)
  
  const handleChangeMinIssues = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinIssues(Number(event.target.value) || null)
  }
  const handleChangeMaxIssues = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxIssues(Number(event.target.value) || null)
  }
  const handleChangeRepository = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRepositoryName(event.target.value)
  }

  useEffect(() => {
    
    (async () => {
      if(organization && repositoryName) {
        setRetry(false)
        setLoading(true);
        setRepositoryError(false)
        try {
          const results = await debouncedSearchRepos({ organization : organization?.login || "", repositoryName })
          setRawResults(results.items)
          setPage(1)
        } catch(error: any) {
          setError(error.message)
          setRepositoryError(true)
          setRepositories([])
        }
        setLoading(false)
      }
    })();

  }, [organization, repositoryName, retry])

  useEffect(() => {
    setRepositories(rawResults.filter(r => (
      !maxIssues || r.open_issues_count < maxIssues) && 
        (!minIssues || r.open_issues_count >= minIssues))) 
  },[rawResults, minIssues, maxIssues])

  return (
    <Box>
    <Box mt={4} display="flex" justifyContent="flex-start" flexDirection="column" width={300}>
      <OrganizationSearchField 
        error={!!error}
        setError={setError}
        organization={organization}
        setOrganization={setOrganization}
        userError={userError}
        setUserError={setUserError}
      />

      {organization && (<>
      <TextField
        sx={{ mt: 2}}
        label="Minimum Issues"
        type="number"
        value={minIssues}
        onChange={handleChangeMinIssues}
      />
      <TextField
        sx={{ mt: 2}}
        label="Maximum Issues"
        type="number"
        value={maxIssues}
        onChange={handleChangeMaxIssues}
      />
      <TextField
        sx={{ mt: 2}}
        label="Repository"
        value={repositoryName}
        onChange={handleChangeRepository}
      />
      </>)}
      {!userError && repositoryError && (<Button sx={{ my: 2 }} onClick={() => setRetry(true)} color="primary" variant="outlined">Retry</Button>)}
    </Box>
    {loading && <CircularProgress size="small" />}
    </Box>
  )
}
