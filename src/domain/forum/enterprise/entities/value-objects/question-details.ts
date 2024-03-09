import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Attachment } from '../attachment'
import { Slug } from './slug'

interface QuestionDetailsProps {
  questionId: UniqueEntityID
  attachments: Attachment[]
  bestAnswerId: UniqueEntityID | null
  title: string
  content: string
  slug: Slug
  authorId: UniqueEntityID
  author: string
  createdAt: Date
  updatedAt: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId(): UniqueEntityID {
    return this.props.questionId
  }

  get attachments(): Attachment[] {
    return this.props.attachments
  }

  get bestAnswerId(): UniqueEntityID | null {
    return this.props.bestAnswerId
  }

  get title(): string {
    return this.props.title
  }

  get content(): string {
    return this.props.content
  }

  get slug(): Slug {
    return this.props.slug
  }

  get authorId(): UniqueEntityID {
    return this.props.authorId
  }

  get author(): string {
    return this.props.author
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps): QuestionDetails {
    return new QuestionDetails(props)
  }
}
