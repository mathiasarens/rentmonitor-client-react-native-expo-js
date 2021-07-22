export default function Alert(props) {
    return (
      <Alert w="100%">
        <Alert.Icon />
        <Alert.Title>{props.title}</Alert.Title>
        <Alert.Description>
            {props.message}
        </Alert.Description>
      </Alert>
    )
  }