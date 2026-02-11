import { GENRES, POPULARITY_OPTIONS } from '../../utils/constants'
import '../../styles/Sidebar.css'

const Sidebar = ({
    genres = GENRES,
    selectedGenre,
    priceFrom,
    priceTo,
    selectedPopularity,
    onGenreFilter,
    onPriceFromChange,
    onPriceToChange,
    onPopularityFilter,
    onClearFilters
}) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-content">
                <h2 className="sidebar-title">Filtros</h2>

                <div className="filter-section">
                    <h3 className="filter-section-title">Género</h3>
                    <div className="filter-options">
                        {genres.map(genre => (
                            <label key={genre} className="filter-option">
                                <input
                                    type="radio"
                                    name="genre"
                                    value={genre}
                                    checked={selectedGenre === genre}
                                    onChange={() => onGenreFilter(genre)}
                                />
                                <span>{genre}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-section">
                    <h3 className="filter-section-title">Precio</h3>
                    <div className="price-filter">
                        <div className="price-input-group">
                            <label htmlFor="price-from">Desde</label>
                            <input
                                type="number"
                                id="price-from"
                                min="0"
                                step="0.01"
                                placeholder="$"
                                value={priceFrom || ''}
                                onChange={(e) => onPriceFromChange(e.target.value)}
                            />
                        </div>
                        <div className="price-input-group">
                            <label htmlFor="price-to">Hasta</label>
                            <input
                                type="number"
                                id="price-to"
                                min="0"
                                step="0.01"
                                placeholder="$"
                                value={priceTo || ''}
                                onChange={(e) => onPriceToChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="filter-section">
                    <h3 className="filter-section-title">Popularidad</h3>
                    <div className="filter-options">
                        {POPULARITY_OPTIONS.map(option => (
                            <label key={option} className="filter-option">
                                <input
                                    type="radio"
                                    name="popularity"
                                    value={option}
                                    checked={selectedPopularity === option}
                                    onChange={() => onPopularityFilter(option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    className="clear-filters-button"
                    onClick={onClearFilters}
                >
                    Limpiar filtros
                </button>
            </div>
        </aside>
    )
}

export default Sidebar

