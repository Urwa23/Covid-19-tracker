import React from 'react'
import numeral from 'numeral'
import './Table.css'

function Table({ countries }) {
    return (
        <div className="table">
            {countries.map((country) => (
        <tr>
          <td>{country.country}</td>
          <td>
            <strong>{numeral(country.cases).format("0,0")}</strong>
          </td>
        </tr>
      ))}
            {/* <p>urwa</p> */}
        </div>
    )
}

export default Table
