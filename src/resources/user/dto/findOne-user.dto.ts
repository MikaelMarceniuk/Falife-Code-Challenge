class FindOneUserDTO {
  id: string
  name: string
  dtNascimento: Date
  sexo: string
  idade?: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export default FindOneUserDTO
