import styles from "@/styles/adminTables.module.css";

/**
 * Generic admin table
 * @param {Object[]} columns - [{ key, label, className?, render? }]
 * @param {Object[]} rows - array of row objects
 * @param {(row: Object) => React.ReactNode} renderActions - optional actions renderer
 * @param {(row: Object) => string|number} rowKey - function to extract unique key
 */
export default function AdminTable({ columns, rows, renderActions, rowKey }) {
  if (!rows || rows.length === 0) {
    return (
      <div className={styles.tableWrapper}>
        <p className={styles.empty}>Aucune donnée à afficher.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={`${styles.th} ${col.className || ""}`}>
                {col.label}
              </th>
            ))}
            {renderActions && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`${styles.td} ${col.className || ""}`}
                >
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {renderActions && (
                <td className={`${styles.td} ${styles.actions}`}>
                  <div className={styles.actionsInner}>
                    {renderActions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}