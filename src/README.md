# CARBON OFFSET & TARIFF ESTIMATOR

An Application built to help e-commerce businesses to calculate supply chain emissions and projected Carbon Border Adjustment Mechanism (CBAM) tariffs.

<!-- short explanation of these terms -->
<details>
    <summary>What is Carbon Border Adjust Mechnanism (CBAM) tariff? What's its significance?</summary>

    - Introduced by European Union(EU) and other countries (eg. Australia, UK, Canada, Turkey, USA) also exploring the options.
    - Based on greenhouse gas emissions generated during the production of certain imported goods, A Carbon price is fixed.
    - GOAL :
        - Eradicate "CARBON LEAKAGE"
        - i.e. when companies(due to EU have stronger climate regulations) move productions to countries with weaker climate regulations and then import the products into the EU.
        - This causes climate depreciation in those countries.

    For further understanding, checkout:
- [What is a Carbon Border Adjustment Mechanism? (Brookings)](https://www.brookings.edu/articles/what-is-a-carbon-border-adjustment-mechanism/)
</details>


<!-- Phase 1-->
## Phase 1 : Project, React Router, JSON-server, Axios instance setup & Data Fetching from JSON-server and rendered the data.
- 🛠️ Tools Used : 
    - React-js, Vite, React-Router, Axios Library, JSON-server, JSX, JS-ES6+, CSS (flex, grid).
- 🔍 Concepts Used :
    - psuedo-backend REST-API setup using JSON-server.
        ran backend using:
    ```bash
        json-server --watch db.json --port port_num
    ```
    -  Configured an Axios instance to avoid more lines of code for API calls.
    ```javascript
    const api = axios.create({
        baseURL: "your_local_url"
    });

    ```
    - Enabled Routing using `react-router-dom` and defined the routes using `<Route>` and navigation using `<Link>`.
    ```javascript
    <Routes>
    <!-- also used :id dynamic paramter for dynamic routing based on ID-->
        <Route path="/shipments/:id" element={<ShipmentDetails />} />
    </Routes>

    <!-- for actual navigation -->
    <Link to="/">Home</Link>
    ```

    - `useState()` to store fetched data, `useEffect()` for side effects (here) API GET call,`async-await` and `try-catch` also used for API GET call, `map()` to dynamically render multiple `<RouteCard/>`
    ```javascript
      useEffect(() => {
        getRoutes();
      }, []);

    // used the centralized axios for simpler API calls inside try-catch
    try{
    const response = await api.get("/routes");
        // store fetched data inside `state`
    }
    catch(error)
    {
        //define what to do if API Get fails
    }

    // map() to render multiple cards
    {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}

    // props to pass data from parent to child component and destructuring to extract values from objects.
    function RouteCard({ route }){
        // fn
    }

    // useParams() to extract dynamic parameter : id for dynamic routing to specific pages/components
      const { id } = useParams();
    ```
    