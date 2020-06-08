export default {
    fields: [{
        type:"text",
        title: "Name",
        name: "Name"
    },{
        type:"text",
        title: "Address",
        name: "FarmAddress"
    },
    {
        type:"number",
        title: "Latitude",
        name: "Latitude"
    },
    {
        type:"number",
        title: "Longitude",
        name: "Longitude"
    },
    {
        type:"checkbox",
        title: "Bio",
        name: "Bio"
    },
    {
        type:"textarea",
        title: "Description",
        name: "Description"
    }],
    endpoint: '/farms',
    title: "Farms",
};