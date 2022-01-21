import { createAction, props } from '@ngrx/store';
import { Tag } from '../models/tag';
import { CreateUpdateTagDto } from '../models/create.tag';
import { TagsPaginationState } from '../../app.state';

/* whenever this action is called, the 'getTags$' effect in tags.effects.ts  is executed */
export const getTags = createAction(
  '[Tag List] Get Tags',
  props<{
    page: number;
    limit: number;
    orderBy?: string;
    sortOrder?: string;
    searchString?: string;
  }>(),
);
export const getTagsSuccess = createAction(
  '[Tags List] Loaded Tags Success',
  props<{ pagination: TagsPaginationState }>(),
);

/* whenever this action is called, the 'createTag$' effect in tags.effects.ts  is executed */
export const createTag = createAction(
  '[Tag List] Create Tag',
  props<{
    tagToCreate: CreateUpdateTagDto;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const createTagSuccess = createAction(
  '[Tag List] Created Tag Success',
  props<{
    createdTag: Tag;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);

export const setSelectedTag = createAction(
  '[Tag List] Set Selected Tag',
  props<{ selectedTag: Tag | null }>(),
);

export const checkIfTagIsInUse = createAction(
  '[Tag] Check if Tag is in use',
  props<{ tag: Tag }>(),
);

export const checkIfTagIsInUseSuccess = createAction(
  '[Tag] Check if Tag is in use Success',
  props<{ isInUse: boolean }>(),
);

export const updateTag = createAction(
  '[Tag List] Update Tag',
  props<{
    id: number;
    tagToUpdate: CreateUpdateTagDto;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const updateTagSuccess = createAction(
  '[Tag List] Update Tag Success',
  props<{
    updatedTag: Tag;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);

export const deleteTag = createAction(
  '[Tag List] Remove Tag',
  props<{
    tagToDelete: Tag;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
export const deleteTagSuccess = createAction(
  '[Tag List] Remove Tag Success',
  props<{
    deletedTag: Tag;
    page: number;
    limit: number;
    orderBy: string;
    sortOrder: string;
    searchString: string;
  }>(),
);
