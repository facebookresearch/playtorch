/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';
import styles from './HttpTester.module.css';

export default function HttpTester({defaultEndpoint = "http://127.0.0.1:5000/", defaultKey = ""}) {
    const [endpoint, setEndpoint] = useState(defaultEndpoint)
    const [formKey, setFormKey] = useState(defaultKey)
    const [formValue, setFormValue] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setResult(null)
        setError(null)

        const data = new FormData()
        data.set(formKey, formValue)
        const response = await fetch(endpoint, {
            method: "POST",
            body: data
        })

        setLoading(false)

        if (!response.ok) {
            setError("Something went wrong")
        } else {
            const jsonResult = await response.json()
            setResult(JSON.stringify(jsonResult, null, 2))
        }
    }
  return (
      <div>
        <form onSubmit={handleSubmit}>
        <label>
          Endpoint:
          <input type="text" value={endpoint} onChange={e => setEndpoint(e.target.value)} />
        </label>
        <div>
        <label>
          Key:
          <input type="text" value={formKey} onChange={e => setFormKey(e.target.value)} />
        </label>
        <label>
          Value:
          <input type="text" value={formValue} onChange={e => setFormValue(e.target.value)} />
        </label>
        </div>
        <input type="submit" value="Submit" />
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {result && <div><pre>{result}</pre></div>}
      </div>
  );
}
