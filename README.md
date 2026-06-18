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

<!-- Global Tech stack used -->
## 🛠️ Tools Used : 
- React-js 
- Vite
- React-Router
- Redux Toolkit
- React-Redux Library : connects React with Redux(toolkit)
- react-toastify Library : alernatives `alert()` popups
- react-confirm-alert  library : alernative to `windows.confirm()`.
- react-loader-spinner library : `Oval` loading indicators.
- react-icons Library : for Operating System independant SVG icons.
- Axios JavaScript Library : to call REST API from components.
- REST API
- JSON-server
- JSX
- JS-ES6+
- CSS (flex, grid)


<!-- Phase 1-->
## Phase 1 : Project, React Router, JSON-server, Axios instance setup & Data Fetching from JSON-server and rendered the data.

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
    ### Phase 1.5 : Landing/Home Page Modification
    - Added 3 sections to Home page, using `Semantic Tags`.
    - used action `scrollIntoView` on Call To Action(CTA) button `onClick` event.
    
## Phase 2 : Working with forms, State management & CRUD(Create,Read,Delete,Update) Operations.

- 🔍 Concepts Used : 
    - created n used Controlled Form Components using `useState()` hook and `...data` : `spread operator`
    ```javascript
    // state to hold data typed by user
    const [formData, setFormData] = useState({
        // initialize formData
    });

   setFormData({
        // Keep all existing data : spread operator for DEEP COPY
      ...formData, 
      // Update only the field that was changed
      [event.target.name]: event.target.value 
    });
    ```
    - Events used : `onClick`, `onSubmit`, `onChange`
    - `useNavigate` hook for navigation controlled by code not user. 
    ```javascript
    // destructure for using useNavigate() hook
    const navigate = useNavigate();
    // as soon as POST request sent automatically navigate back to Shipments page
    navigate("/shipments");
    ```
    - To prevent automatic Form reload `onSubmit`
    ```javascript
        event.preventDefault(); 
    ```
    - used and applied CRUD Lifestyle : 
        - `C`reate via `POST` request
        - `R`ead via `GET` request
        - `U`pdate via `PUT` request
        - `D`elete via `DELETE` request
    - optimized UI re-rendering using `array.filter()` in place of expensive `server re-fetch`.
    - Built UX "Escape Latches" to allow users to exit forms easily using `<Link>`.
    - Used simple `Geopoltical Emission & Tariff Algorithms` to calculate the `tariff`.
### Phase Issue 2.1 : Handling `<img>` failing to render image.
- 2 layered fallback strategy :
    - Strategy 1 :
        - `onError` Event inside `<img>` that defines action if image fails to load, where `src` attribute swaps image with more reliable default image.
    - Strategy 2 :
        - in CSS, modified image containers with :
            1. fixed dimension
            2. block display (all contents must start with new line, since each content must occupy all space  irrespective of the given space it actually uses.)
            3. neutral background color : acts as skeleton loader.

<!-- phase 3 -->
## Phase 3 : User Authentication & ProtectedRoutes  
- 🔍 Concepts Used :
    - Added Register,Login forms (update against JSON server database), Logout option and a Delete Account option.
        - also used LocalStorage:
        ```javascript
        // store credentials of user who has logged in to avoid logging out on Page Refresh, accidental closing of Tab/Browser.
        // We have to use JSON.stringify because localStorage ONLY accepts strings :  js obj => json obj
        localStorage.setItem("user", JSON.stringify(response.data[0]));

        // Force a quick page reload so our Navbar updates to show the logged-in state(since login n shipment pages not related, so to
        // reflect changes in localStorage which can be seen by  Shipments page)
        window.location.reload();

          
        useEffect(() => {

              // 1. Erase the user from the browser's memory
            localStorage.removeItem("user");
        }, [])

          // Check if someone is logged in
          // JSON.parse() : json obj  => usable js obj
        const user = JSON.parse(localStorage.getItem("user"));

        ```
    - dynamic Navbar UI rendering based on Login status:
        - before login:
            <img src="src/assets/beforelogin.png" alt="Screenshot1" width="1000">
        - after login : 
            <img src="src/assets/afterlogin.png" alt="Screenshot2" width="1000">
    - developed a  `ProtectedRoute` that acts as a `Bouncer` to prevent unauthorized access to `Add/Edit-route` features.
    - `UI Access Control` : conditionally render (&& operator) `Edit` and `Delete` and `Draft-Route` features to only allows, logged in users to avail these features.
    - used <Navigate> automatic redirect while rendering inside  `ProtectedRoute`
    
    ```javascript
        return <Navigate to="/login" replace />;
        // without replace : on clicking go back (<) button, takes you back to ProtectedPage (not preferred)
        // protectedpage <=> login (no replace)
        //with replace : on clicking go back (<) button, skips going back.
        // protectedpage -> login (with replace, no going back)
    ```

## Phase 4 : Global State Management (Redux Toolkit)
- create a central vault for states : `store` that eliminates the issue of `props drilling` using `Redux Toolkit`.
```javascript
export const store = configureStore({
    // fn(s) to manipulate states globally
  reducer: {
    // We register our specific "department" (slice) in the store : watchlist (name must match the name defined in the slice)
    favorites: favoritesReducer,
  },
})

```
- terminologies : 
    1. `Slice` : dept/feature
    2. `state`: dynamic variable whose change in value driggers react component re-render
    3. `reducer` : fn to manipulate `state` globally(similar to react's `setState()`)
    4. `action type`: which reducer fn called
    5. `action payload` : data sent by user.
    6. `store` : vault where all states exist and stored.

- create `Slice` for `routes considered critical by the user`
```javascript
export const watchlistSlice = createSlice({
    // this name would be used by useDispatch (send data to store): to update state value
  name: "watchlist",
  
  // The initial state is just an empty array (no pinned routes yet)
  initialState: [],
  
  // Reducers are the "Bank Tellers" - the functions that actually change the data (similar to setstate() in react)
  reducers: {
    
    // Action 1: Pinning a route to the watchlist
    pinRoute: (state, action) => {
      // 'action.payload' is the entire route object we click on to save (payload : data sent by user)
      const newRoute = action.payload;

      // Look through our current state to see if this EXACT route already exists (checking for duplicates) using find() : returns true/false
      const exists = state.find((route) => route.id === newRoute.id);

      // if not a duplicate, then save to the state   
      if (!exists) {
        // use .push() to safely add the item
        state.push(newRoute); 
      } else {
        // If its duplicate don't save , alert the user 
        alert("This specific route is already pinned to your Watchlist!");
      }
    },

    // Action 2: Unpinning a route
    unpinRoute: (state, action) => {
      // 'action.payload' will be the ID of the route we want to remove
      // filter() : to dynamically update the watchlist [] by ignoring routes we want to unpin
      return state.filter((route) => {
        return route.id !== action.payload
      });
    }
```

- connected `react` with `redux toolkit` using `react-redux` library, also used hooks provided by this library:
    1. `useSelector()` hook : to get data from the `store`.
    2. `useDispatch()` hook : to send data to the `store`.
```javascript
  // wrap entire App inside Provider(react-redux connects react with redux) : so the Store(global vault with various depts -Slices) 
  // available[Read/Write access to Store's Slice's States] to all components
  // inside the App.jsx
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>

  // 1. Initialize Redux dispatcher
  const dispatch = useDispatch();

  // 2. Read the current watchlist from the Redux Vault
  const watchlist = useSelector((state) => state.watchlist);

  // 3. Check if THIS specific route is already inside the watchlist
  const isPinned = watchlist.some((item) => item.id === route.id);

    function handlePin() {
    // send complete route obj to store
    dispatch(pinRoute(route));
  }

    function handleUnpin() {
    // send to route id to store for unpinning
    dispatch(unpinRoute(route.id));
  }
```
- Implemented dynamic History Navigation (`useNavigate(-1)`) in `ShipmentDetails.jsx` to allow user to go back to immediately visited page(`Shipment.jsx` or `Watchlist.jsx`) to maintain user's flow.[in place of `<Link>` tag.]


### Phase 4.1 : UI/UX Modification
- instead of blocking, styleless native browser `alert()` popups,
  used non-blocking toast notifications via `react-toastify` library.
  ```javascript
  // alert('message')
  toast.error('msg')
  toast.success('msg')
  toast.warning('msg')
  toast.info('msg')
  ```
- instead of using `windows.confirm()` popup for `Delete Account`, used a customizable, `react-modal`.
  ```javacript
    confirmAlert({
      title: 'Confirm Account Deletion',
      message: 'Are you sure you want to permanently delete your corporate account? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes, Delete It',
          // 2. If they click yes, we run your EXACT asynchronous logic!
          onClick: async () => {
            // only for logged in user
            if (user) {
              try {
                // Delete the user from the JSON database
                
                // Clear local storage
                
                // Show the success toast
                toast.success(`Corporate Account deleted successfully. Sorry to see you go.`); 

                // Wait 2 seconds, then redirect and refresh
                setTimeout(() => {
                    navigate("/register");
                    window.location.reload();
                }, 2000);

              } catch (error) {
                toast.error("Couldn't delete the account.");
                console.log("Error deleting account:", error);
              }
            }
          }
        },
        {
          label: 'Cancel',
          // If they click cancel, the modal simply closes and does nothing.
          onClick: () => {} 
        }
      ]
    });
  ```
- implemented `Oval` loading indicators to `Shipments` and `ShipmentDetails` pages to visually communicate background data fetching to the user, eliminating blank screens during load times.

- in-place of O.S. dependant text emojis, used O.S. independant SVG icons via `react-icons` Library.

- `Teaser UI` : Instead of completely hiding features from unauthenticated users, the app uses "Feature Discovery." Logged-out users see a teaser banner and greyed-out action buttons (indicating locked features) that trigger a prompt to create an account, to unlock the features.
