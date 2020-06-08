export default ({comm}) => ({
    fields: [
      {
        type: "number",
        title: "Limit",
        name: "EventLimit",
      },
      {
        type: "text",
        title: "Name",
        name: "EventName",
      },
      {
        type: "text",
        title: "Start",
        attributes: {type: "datetime-local"},
        name: "EventStart",
        loadFormatter: (v) => v && v.substr(0, 16),
        updateFormatter: (value) => value.toString() + ":00.000Z"

      },
      {
        type: "text",
        title: "End",
        attributes: {type: "datetime-local"},
        name: "EventEnd",
        loadFormatter: (v) => v && v.substr(0, 16),
        updateFormatter: (value) => value.toString() + ":00.000Z"
      },
      {
          type: "dropdown",
          name: "farm",
          title: "Farm",
          options: ()=> comm.get("/farms/farmerfarms").then(r=> {
              console.log(r.data);
              return r.data.map(f=> ({value: f.id, text: f.Name}));
          })
      },
      {
          type:"textarea",
          title: "Description",
          name: "Description"
      },
    ],
    endpoint: "/events",
    title: "Events"
  });