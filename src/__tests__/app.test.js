import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  cleanup,
  act
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App.js";
import { createMemoryHistory } from "history";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, MemoryRouter, Router } from "react-router-dom";
import Pagination from "../Components/Pagination.jsx";
import AppContextProvider, { appReducer } from "../Context/AppContext.jsx";
import PrivateRoute from "../Components/PrivateRoute.jsx";
import fetchMock from "fetch-mock";

/**
 *
 * DO NOT CHANGE ANYTHING HERE
 */
beforeAll(() => {
  jest.setTimeout(60000);
  // attempt is 1
  global.score = 1;
  console.log("Resetting Score to 1");
});
beforeEach(() => {
  cleanup();
});

test("pagination component works correctly 1", async () => {
  const fn = jest.fn();
  const { debug, getByTestId, getAllByTestId, findAllByTestId } = render(
    <Pagination changePage={fn} total={5} current={2} />
  );
  const pages = getAllByTestId("page-btn");
  expect(pages.length).toBe(5);
  [
    // disabled correct one
    (null, true, null, null, null)
  ].forEach((state, i) => {
    expect(pages[i].getAttribute("disabled")).toBe(state);
  });
  // on click change buttons
  // on click change buttons
  fireEvent.click(pages[1]);
  expect(fn).toBeCalledTimes(0);
  fireEvent.click(pages[4]);
  expect(fn).toBeCalledTimes(1);
  expect(fn).toBeCalledWith(5);
  fireEvent.click(pages[4]);
  expect(fn).toBeCalledTimes(2);
  expect(fn).toBeCalledWith(5);
  global.score += 0.5;
});
test("pagination component works correctly 2 ", async () => {
  const fn = jest.fn();
  const { debug, getByTestId, getAllByTestId, findAllByTestId } = render(
    <Pagination changePage={fn} total={8} current={4} />
  );
  const pages = getAllByTestId("page-btn");
  expect(pages.length).toBe(8);
  [
    // disabled correct one
    (null, null, null, null, true, null, null, null)
  ].forEach((state, i) => {
    expect(pages[i].getAttribute("disabled")).toBe(state);
  });
  // on click change buttons
  fireEvent.click(pages[4]);
  expect(fn).toBeCalledTimes(1);
  expect(fn).toBeCalledWith(5);
  fireEvent.click(pages[4]);
  expect(fn).toBeCalledTimes(2);
  expect(fn).toBeCalledWith(5);
  global.score += 0.5;
});

test("App loads correctly", async () => {
  jest.mock("react-router-dom", () => {
    return {
      Redirect: jest.fn(({ to }) => `Redirected to ${to}`)
    };
  });
  const { debug, getByTestId, getAllByTestId, findAllByTestId } = render(
    <MemoryRouter initialEntries={["/"]}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </MemoryRouter>
  );

  const login = getByTestId("login-link");
  const dashboard = getByTestId("dashboard-link");
  expect(login).toHaveTextContent("Login Page");
  expect(dashboard).toHaveTextContent("Dashboard");
  global.score += 0.5;
});

test("Private Route component redirects user to login when visiting /dashboard page", async () => {
  const { debug, getByTestId, getAllByTestId, findAllByTestId } = render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </MemoryRouter>
  );

  const form = getByTestId("login-form");
  expect(form).toBeInTheDocument();
  global.score += 0.5;
});
// login page

test("Login page works correctly", async () => {
  fetchMock.post("https://reqres.in/api/login", 200, {
    response: {
      body: {
        token: "ABCD"
      }
    }
  });
  fetchMock.get(
    "https://jsonplaceholder.typicode.com/photos?_page=1&_limit=10",
    200,
    {
      response: {
        body: []
      }
    }
  );
  const { debug, getByTestId, getAllByTestId, findByTestId } = render(
    <MemoryRouter initialEntries={["/login"]}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </MemoryRouter>
  );

  const form = getByTestId("login-form");
  const email = getByTestId("email-input");
  const password = getByTestId("password-input");
  const submit = getByTestId("form-submit");

  expect(form).toBeInTheDocument();
  expect(email).toBeInTheDocument();
  expect(password).toBeInTheDocument();
  expect(submit).toBeInTheDocument();

  const values = {
    email: "eve.holt@reqres.in",
    password: "cityslicka"
  };
  fireEvent.change(email, {
    target: {
      value: values.email
    }
  });

  fireEvent.change(password, {
    target: {
      value: values.password
    }
  });

  expect(email.value).toBe(values.email);
  expect(password.value).toBe(values.password);
  await act(() => {
    fireEvent.click(submit);
  });
  expect(fetchMock.done()).toBe(true);
  const token = await findByTestId("token");
  expect(token).toHaveTextContent("ABCD");
  global.score += 2;
  {
    const logout = getByTestId("logout-btn");
    await act(() => {
      fireEvent.click(logout);
    });
    const form = getByTestId("login-form");
    expect(form).toBeInTheDocument();
  }
  global.score += 1;
});

test("Dasbhoard page works correctly", async () => {
  const page1 = [
    {
      albumId: 1,
      id: 1,
      title: "accusamus beatae ad facilis cum similique qui sunt",
      url: "https://via.placeholder.com/600/92c952",
      thumbnailUrl: "https://via.placeholder.com/150/92c952"
    },
    {
      albumId: 1,
      id: 2,
      title: "reprehenderit est deserunt velit ipsam",
      url: "https://via.placeholder.com/600/771796",
      thumbnailUrl: "https://via.placeholder.com/150/771796"
    },
    {
      albumId: 1,
      id: 3,
      title: "officia porro iure quia iusto qui ipsa ut modi",
      url: "https://via.placeholder.com/600/24f355",
      thumbnailUrl: "https://via.placeholder.com/150/24f355"
    },
    {
      albumId: 1,
      id: 4,
      title: "culpa odio esse rerum omnis laboriosam voluptate repudiandae",
      url: "https://via.placeholder.com/600/d32776",
      thumbnailUrl: "https://via.placeholder.com/150/d32776"
    },
    {
      albumId: 1,
      id: 5,
      title: "natus nisi omnis corporis facere molestiae rerum in",
      url: "https://via.placeholder.com/600/f66b97",
      thumbnailUrl: "https://via.placeholder.com/150/f66b97"
    },
    {
      albumId: 1,
      id: 6,
      title: "accusamus ea aliquid et amet sequi nemo",
      url: "https://via.placeholder.com/600/56a8c2",
      thumbnailUrl: "https://via.placeholder.com/150/56a8c2"
    },
    {
      albumId: 1,
      id: 7,
      title: "officia delectus consequatur vero aut veniam explicabo molestias",
      url: "https://via.placeholder.com/600/b0f7cc",
      thumbnailUrl: "https://via.placeholder.com/150/b0f7cc"
    },
    {
      albumId: 1,
      id: 8,
      title: "aut porro officiis laborum odit ea laudantium corporis",
      url: "https://via.placeholder.com/600/54176f",
      thumbnailUrl: "https://via.placeholder.com/150/54176f"
    },
    {
      albumId: 1,
      id: 9,
      title: "qui eius qui autem sed",
      url: "https://via.placeholder.com/600/51aa97",
      thumbnailUrl: "https://via.placeholder.com/150/51aa97"
    },
    {
      albumId: 1,
      id: 10,
      title: "beatae et provident et ut vel",
      url: "https://via.placeholder.com/600/810b14",
      thumbnailUrl: "https://via.placeholder.com/150/810b14"
    }
  ];
  const page2 = [
    {
      albumId: 1,
      id: 11,
      title: "nihil at amet non hic quia qui",
      url: "https://via.placeholder.com/600/1ee8a4",
      thumbnailUrl: "https://via.placeholder.com/150/1ee8a4"
    },
    {
      albumId: 1,
      id: 12,
      title:
        "mollitia soluta ut rerum eos aliquam consequatur perspiciatis maiores",
      url: "https://via.placeholder.com/600/66b7d2",
      thumbnailUrl: "https://via.placeholder.com/150/66b7d2"
    },
    {
      albumId: 1,
      id: 13,
      title: "repudiandae iusto deleniti rerum",
      url: "https://via.placeholder.com/600/197d29",
      thumbnailUrl: "https://via.placeholder.com/150/197d29"
    },
    {
      albumId: 1,
      id: 14,
      title: "est necessitatibus architecto ut laborum",
      url: "https://via.placeholder.com/600/61a65",
      thumbnailUrl: "https://via.placeholder.com/150/61a65"
    },
    {
      albumId: 1,
      id: 15,
      title: "harum dicta similique quis dolore earum ex qui",
      url: "https://via.placeholder.com/600/f9cee5",
      thumbnailUrl: "https://via.placeholder.com/150/f9cee5"
    },
    {
      albumId: 1,
      id: 16,
      title:
        "iusto sunt nobis quasi veritatis quas expedita voluptatum deserunt",
      url: "https://via.placeholder.com/600/fdf73e",
      thumbnailUrl: "https://via.placeholder.com/150/fdf73e"
    },
    {
      albumId: 1,
      id: 17,
      title: "natus doloribus necessitatibus ipsa",
      url: "https://via.placeholder.com/600/9c184f",
      thumbnailUrl: "https://via.placeholder.com/150/9c184f"
    },
    {
      albumId: 1,
      id: 18,
      title: "laboriosam odit nam necessitatibus et illum dolores reiciendis",
      url: "https://via.placeholder.com/600/1fe46f",
      thumbnailUrl: "https://via.placeholder.com/150/1fe46f"
    },
    {
      albumId: 1,
      id: 19,
      title: "perferendis nesciunt eveniet et optio a",
      url: "https://via.placeholder.com/600/56acb2",
      thumbnailUrl: "https://via.placeholder.com/150/56acb2"
    },
    {
      albumId: 1,
      id: 20,
      title:
        "assumenda voluptatem laboriosam enim consequatur veniam placeat reiciendis error",
      url: "https://via.placeholder.com/600/8985dc",
      thumbnailUrl: "https://via.placeholder.com/150/8985dc"
    }
  ];
  fetchMock.post("https://reqres.in/api/login", 200, {
    response: {
      body: {
        token: "ABCD"
      }
    },
    overwriteRoutes: true
  });
  fetchMock.get(
    "https://jsonplaceholder.typicode.com/photos?_page=1&_limit=10",
    200,
    {
      response: {
        body: page1
      },
      overwriteRoutes: true
    }
  );
  fetchMock.get(
    "https://jsonplaceholder.typicode.com/photos?_page=2&_limit=10",
    200,
    {
      response: {
        body: page2
      },
      overwriteRoutes: true
    }
  );
  const history = createMemoryHistory();
  const { debug, getByTestId, getAllByTestId, findByTestId } = render(
    <MemoryRouter history={history} initialEntries={["/login"]}>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </MemoryRouter>
  );
  {
    const form = getByTestId("login-form");
    const email = getByTestId("email-input");
    const password = getByTestId("password-input");
    const submit = getByTestId("form-submit");

    expect(form).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(submit).toBeInTheDocument();

    const values = {
      email: "eve.holt@reqres.in",
      password: "cityslicka"
    };
    fireEvent.change(email, {
      target: {
        value: values.email
      }
    });

    fireEvent.change(password, {
      target: {
        value: values.password
      }
    });

    expect(email.value).toBe(values.email);
    expect(password.value).toBe(values.password);
    await act(() => {
      fireEvent.click(submit);
    });

    const token = await findByTestId("token");
    expect(token).toHaveTextContent("ABCD");
  }
  {
    const items = getAllByTestId("item");
    expect(items.length).toBe(page1.length);
    page1.forEach((res, i) => {
      expect(items[i]).toHaveTextContent(res.title);
    });
  }
  const pages = getAllByTestId("page-btn");
  expect(pages.length).toBe(5);
  global.score += 2;
  await act(() => {
    fireEvent.click(pages[1]);
  });

  {
    const items = getAllByTestId("item");
    expect(items.length).toBe(page1.length);
    page2.forEach((res, i) => {
      expect(items[i]).toHaveTextContent(res.title);
    });
  }
  // expect(global.window.location.pathname).toEqual('/dashboard');

  global.score += 2;
});
describe("reducers", () => {
  test("reducers default case work correctly", async () => {
    const initState = {
      isAuth: false,
      token: null
    };
    let state = appReducer(initState, { type: "@INIT" });
    expect(initState).toEqual(state);
  });

  test("reducers login success case work correctly", async () => {
    const initState = {
      isAuth: false,
      token: null
    };
    let state = appReducer(initState, {
      type: "LOGIN_SUCCESS",
      payload: {
        token: "ABCD"
      }
    });
    expect(state).toEqual({ isAuth: true, token: "ABCD" });
  });

  test("reducers logout success case work correctly", async () => {
    const initState = { isAuth: true, token: "ABCD" };
    let state = appReducer(initState, {
      type: "LOGOUT_SUCCESS"
    });
    expect(state).toEqual({ isAuth: false, token: null });
  });
  global.score += 1.5;
});

// dashboard

afterAll(() => {
  console.log("Final Score is", global.score);
});

function sleep(delay) {
  return new Promise((res) => setTimeout(res, delay));
}
