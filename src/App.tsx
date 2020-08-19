import './App.css';

import React, {useCallback, useEffect, useState} from 'react';

import Table from './components/table/Table';
import {loadUsers} from './utils/Utils';

const App: React.FC = () => {  
  const [data, setData] = useState<any[]>([]);

  const firstCall = useCallback(async () => setData(await loadUsers(100)), []);
  const loadMoreData = useCallback(async () => loadUsers(50), []);

  useEffect(() => {
    firstCall()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data.length
    ? <Table
        data={data}
        columns={['firstName', 'lastName', 'email', 'city', 'gender']}
        loadMoreData={loadMoreData}
      />
    : <p>Loading starting data...</p>;
}

export default App;
