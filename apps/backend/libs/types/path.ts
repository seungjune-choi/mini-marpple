export type Path<T = string> = T extends `/${string}` ? T : never;
