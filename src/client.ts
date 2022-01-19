const BASE_URL = "https://api.github.com";

export interface User {
    login: string;
    id: number;
}

export interface SearchUsersResponse {
  total_count: number;
  items: Array<User>;
}

export const getOrg = async (org: string) => {
  return fetch(`${BASE_URL}/orgs/${org}`).then((res) => res.json());
};

const fetchHandler = 
    (res : Response) => {
      if(!res.ok) {
        throw Error(res.statusText)
      }
      return res.json()
    }

const fetchErrorHandler = (err: any) => { throw new Error('Error: Network Error')}

export const searchUsers = async (searchString: string) : Promise<SearchUsersResponse> => {
  return fetch(`${BASE_URL}/search/users?q=${searchString}+type:org`)
  .catch(fetchErrorHandler) 
  .then(fetchHandler)
};

interface SearchRepositoryOptions {
  repositoryName: string;
  organization: string
}

export interface Repository {
  name : string;
  open_issues_count: number;
  stargazers_count: number;
}

export interface SearchRepositoryResponse {
  total_count: number;
  items: Array<Repository>;
}

export const searchRepositories = async (options: SearchRepositoryOptions): Promise<SearchRepositoryResponse> => {
  const { organization, repositoryName } = options
  return fetch(`${BASE_URL}/search/repositories?q=${repositoryName}+org:${organization}`)
  .catch(fetchErrorHandler)
  .then(fetchHandler);
}
