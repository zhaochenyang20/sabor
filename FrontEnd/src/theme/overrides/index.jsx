import { merge } from "lodash";
import Card from "./card";
import Paper from "./paper";
import Button from "./button";

// ----------------------------------------------------------------------

export default function ComponentsOverrides(theme) {
  return merge(Card(theme), Paper(theme), Button(theme));
}
