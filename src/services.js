/**
 *  Fetch data from REST API via HTTP request.
 *
 * @param {string} endpoint.
 * @returns {JSON} response from API.
 */
const getData = (endpoint) => {
   return fetch(endpoint)
     .then((response) => {
       if (!response.ok) throw new Error(response.statusText);
       return response.json();
     })
     .catch((err) => {
       throw new Error(
         `There was the following problem: ${err} while fetching ${endpoint}`
       );
     });
 };
 
 export { getData };

/**
 * Check if number of items exceeds the desired end of catalogue.
 *
 * @param {number} currentPage.
 * @param {number} batchSize.
 * @param {number} maxCatalogueLength.
 * @returns {boolean}
 */
export function checkEndOfCatalogue(
   currentPage,
   batchSize,
   maxCatalogueLength
) {
   return batchSize * currentPage > maxCatalogueLength;
}