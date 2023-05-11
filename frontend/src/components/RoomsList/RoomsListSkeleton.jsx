import { Grid, Skeleton } from "@mui/material";

export const RoomsListSkeleton = () => {
  const list = [1, 2, 3, 4, 5];
  return (
    <Grid container spacing={2}>
      {list.map((i) => {
        return (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Skeleton
              width="100%"
              variant="rounded"
              animation="wave"
              height={150}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default RoomsListSkeleton;
