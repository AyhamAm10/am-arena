import { Redirect, useLocalSearchParams } from "expo-router";

export default function TournamentCompatRedirect() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = rawId ?? "";
  return <Redirect href={`/tournament/${id}/registration` as never} />;
}
