/**
 * FilmArchivePlanner (FAP)
 * REST API for the FAP backend.
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface CreateUpdateDirectorDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  biographyEnglish: string;
  biographyGerman?: string;
  filmography: string;
}
