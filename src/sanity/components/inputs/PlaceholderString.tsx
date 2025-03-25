import {
  type StringInputProps,
  useFormValue,
  type SanityDocument,
  type StringSchemaType,
} from "sanity";

type Props = StringInputProps<
  StringSchemaType & { options?: { field?: string } }
>;

const PlaceholderStringInput = (props: Props) => {
  const { schemaType } = props;

  const path = schemaType?.options?.field;
  const doc = useFormValue([]) as SanityDocument;

  const proxyValue =
    path?.split(".").reduce((obj: any, key) => obj?.[key], doc) ?? "";

  return props.renderDefault({
    ...props,
    elementProps: { ...props.elementProps, placeholder: proxyValue },
  });
};

export default PlaceholderStringInput;
