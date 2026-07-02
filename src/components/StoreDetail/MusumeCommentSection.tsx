import React from 'react'
import { MusumeComment, MusumeCharacter } from '@/types/store'

interface MusumeCommentSectionProps {
  comment: MusumeComment
}

const CHARACTER_INFO: Record<MusumeCharacter, { name: string; image: string }> = {
  kanon: { name: 'かのん', image: '/images/girl-kanon-up.png' },
  saki: { name: 'さき', image: '/images/girl-saki-up.png' },
}

/**
 * 豚饅娘の一言セクション
 * 豚饅娘が実際に食べた店舗にのみ表示される、イラスト付きの一言コメント
 */
export default function MusumeCommentSection({ comment }: MusumeCommentSectionProps) {
  const character = CHARACTER_INFO[comment.character]

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        豚饅娘の一言
      </h3>
      <div className="flex items-start gap-3">
        {/* キャラクターイラスト */}
        <div className="shrink-0 text-center">
          <img
            src={character.image}
            alt={`豚饅娘 ${character.name}`}
            className="w-14 h-14 rounded-full object-cover object-top border-2 border-pig-pink-border bg-pig-pink/20"
          />
          <span className="block mt-1 text-xs text-gray-600 dark:text-gray-400">
            {character.name}
          </span>
        </div>

        {/* 吹き出し */}
        <div className="flex-1 bg-pig-pink/20 dark:bg-pig-pink/10 border-2 border-pig-pink-border rounded-2xl rounded-tl-none px-4 py-3">
          <p className="text-gray-900 dark:text-white leading-relaxed">
            {comment.text}
          </p>
          {comment.visitDate && (
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
              訪問日: {comment.visitDate}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
