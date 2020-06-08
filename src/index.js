

import EditorEnvironment from './EditorEnvironment'
import EditorFieldConnector from './EditorFieldConnector'
import Converters from './Converters'


export {
  EditorEnvironment,
  Converters,
  EditorFieldConnector
}

/*export default function Editor({ schema: initialSchema, id, onClose }) {
  const schemaRef = useRef(null);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const comm = useCommunicator();

  const onUpdate = (fieldSchema, newValue) => {
    const newData = { ...data, [fieldSchema.name]: newValue };
    console.log("field update", newValue, fieldSchema, newData);
    setData(newData);
  };

  const clearFieldsOfResponse = (d) => {
    console.log(d)
    const d2 = {...d};
    Object.keys(d).forEach(key=> {
      if(Array.isArray(d2[key])) delete d2[key];
      else if (typeof d[key] === "object" && d[key] && d[key].id != null) d2[key] = d2[key].id; 
    })
    console.log(d2, "d2")
    return d2;
  }

  // Loading data from server if id provided
  const loadData = () => {
    console.log("loadData", schemaRef.current, id);
    if (id == null) {
      setData({ ...(schemaRef.current.initialValue || {}) });
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    comm
      .get(schemaRef.current.endpoint + "/" + id)
      .then((r) => {
        setData(clearFieldsOfResponse( r.data));
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const initializeFields = () => {
    setIsLoading(true);
    const newSchema = [];
    const waitFieldInit = [];

    for (let i = 0; i < initialSchema.fields.length; i++) {
      const f = initialSchema.fields[i];
      if (f.type == "dropdown" && typeof f.options == "function") {
        const f2 = { ...f, options: null };
        const p = f.options().then((o) => (f2.options = o));
        newSchema.push(f2);
        waitFieldInit.push(p);
      } else {
        newSchema.push({ ...f });
      }
    }
    Promise.all(waitFieldInit).then(() => {
      schemaRef.current = { ...initialSchema, fields: newSchema };
      loadData();
    });
  };

  // starting the initialization of editor window
  useEffect(initializeFields, []);

  const saveData = () => {
    if (id != null) {
      comm
        .put(schemaRef.current.endpoint + "/" + data.id, data)
        .then((r) => onClose())
        .catch((err) => console.log(err));
    } else {
      comm
        .post(schemaRef.current.endpoint, data)
        .then((r) => onClose())
        .catch((err) => console.log(err));
    }
  };

  const del = () => {
    if (id == null) return;
    comm.delete(schemaRef.current.endpoint + "/" + id).then(r=> onClose());
  }

  return (
    <Modal isOpen={true} toggle={() => {onClose()}} className="modal-dialog-centered ">
      <ModalHeader toggle={() => {onClose()}}>{schemaRef.current && schemaRef.current.title}</ModalHeader>
      <ModalBody>
        {!isLoading && schemaRef.current && (
          <>
            {schemaRef.current.fields.map((f) => (
              <EditorField schema={f} onUpdate={onUpdate} value={data[f.name]} />
            ))}
          </>
        )}
        {isLoading && (
          <div className="d-flex justify-content-center my-4">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
            <div className="form-group text-right">
        {(id != null ) && <button type="button" className="btn btn-danger  mx-1" onClick={()=> {del()}}>Delete</button> }
              <button type="button" className="btn btn-primary mx-1" onClick={()=> saveData()}>Save</button>
            </div>

      </ModalFooter>
    </Modal>
  );
}*/


