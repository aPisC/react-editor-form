export default {
    fields: [
      {
        type: "text",
        name: "Name",
        title: "Name",
      },
      {
        type: "number",
        name: "Price",
        title: "Price",
      },
      {
        type: "dropdown",
        name: "event",
        title: "Event",

        options: () =>
          comm.get("/events/farmerevents").then((r) => {
            console.log(r.data);
            return r.data.map((f) => ({ value: f.id, text: f.EventName }));
          }),
      },
      {
        type: "dropdown",
        name: "product",
        title: "Product",
        options: () =>
          comm.get("/products/farmerproducts").then((r) => {
            console.log(r.data);
            return r.data.map((f) => ({ value: f.id, text: f.ProductType }));
          }),
      },
    ],
    endpoint: "/ticket-types",
    title: "Ticket Type"
  };