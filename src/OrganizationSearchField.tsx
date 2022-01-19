import React, { Dispatch, SetStateAction, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { searchUsers, User } from './client';
import debouncePromise from 'awesome-debounce-promise'
import { Button } from '@mui/material';

const debouncedSearchUsers = debouncePromise(searchUsers, 200)

interface OrganizationSearchFieldProps {
  setError : Dispatch<SetStateAction<string>>
  error: boolean 
  organization: User | null;
  setOrganization: Dispatch<SetStateAction<User | null>>
  setUserError: Dispatch<SetStateAction<boolean>>
  userError: boolean;
}

export function OrganizationSearchField({ setError, setOrganization, userError, setUserError }: OrganizationSearchFieldProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly User[]>([]);
  const [searchString, setSearchString] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [retry, setRetry] = React.useState(false)

  useEffect(() => {
    setLoading(true);
    setRetry(false)
    setError('');
    setUserError(false)

    const getUsers = async () => {
      let result
      try{
        result = await debouncedSearchUsers(searchString);
        setOptions(result.items || [])
      } catch(error: any) {
        setError("Error: Something went wrong.") 
        setUserError(true)
        setOrganization(null)
      }
      setLoading(false)
    }
   
    (async() => {
      await getUsers();
    })()

  }, [searchString, retry, setError, setOrganization, setUserError]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
    <Autocomplete
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.login === value.login}
      getOptionLabel={(option) => option.login}
      options={options}
      loading={loading}
      onChange={(e: any, value: User | null) => {
        setOrganization(value) 
      }}
      onInputChange={(e: any, newInputValue) => {
        setSearchString(newInputValue)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Organization"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
    {userError && <Button sx={{ my: 2 }} onClick={() => setRetry(true)} color="primary" variant="outlined">Retry</Button>}
    </>
  );
}
